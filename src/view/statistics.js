import flatpickr from "flatpickr";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {getCurrentDate} from "../utils/task.js";
import {
  countCompletedTaskInDateRange,
  makeItemsUniq,
  countTasksByColor,
  colorToHex,
  countTasksInDateRange,
  parseChartDate,
  getDatesInRange
} from "../utils/statistics.js";

const renderColorsChart = (colorsCtx, tasks) => {
  const taskColors = tasks.map((task) => task.color);
  const uniqColors = makeItemsUniq(taskColors);
  const taskByColorCounts = uniqColors.map((color) => countTasksByColor(tasks, color));
  const hexColors = uniqColors.map((color) => colorToHex[color]);

  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: uniqColors,
      datasets: [{
        data: taskByColorCounts,
        backgroundColor: hexColors
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderDaysChart = (daysCtx, tasks, dateFrom, dateTo) => {
  const dates = getDatesInRange(dateFrom, dateTo);
  const parsedDates = dates.map(parseChartDate);
  const taskInDateRangeCounts = countTasksInDateRange(dates, tasks);

  return new Chart(daysCtx, {
    plugins: [ChartDataLabels],
    type: `line`,
    data: {
      labels: parsedDates,
      datasets: [{
        data: taskInDateRangeCounts,
        backgroundColor: `transparent`,
        borderColor: `#000000`,
        borderWidth: 1,
        lineTension: 0,
        pointRadius: 8,
        pointHoverRadius: 8,
        pointBackgroundColor: `#000000`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 8
          },
          color: `#ffffff`
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            fontStyle: `bold`,
            fontColor: `#000000`
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (data) => {
  const {tasks, dateFrom, dateTo} = data;
  const completedTaskCount = countCompletedTaskInDateRange(tasks, dateFrom, dateTo);

  return `<section class="statistic container">
    <div class="statistic__line">
      <div class="statistic__period">
        <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

        <div class="statistic-input-wrap">
          <input class="statistic__period-input" type="text" placeholder="">
        </div>

        <p class="statistic__period-result">
          In total for the specified period
          <span class="statistic__task-found">${completedTaskCount}</span>
          tasks were fulfilled.
        </p>
      </div>
      <div class="statistic__line-graphic">
        <canvas class="statistic__days" width="550" height="150"></canvas>
      </div>
    </div>

    <div class="statistic__circle">
      <div class="statistic__colors-wrap">
        <canvas class="statistic__colors" width="400" height="300"></canvas>
      </div>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(tasks) {
    super();

    this._data = {
      tasks,
      // По условиям техзадания по умолчанию интервал - неделя от текущей даты
      dateFrom: (() => {
        const daysToFullWeek = 6;
        const date = getCurrentDate();
        date.setDate(date.getDate() - daysToFullWeek);
        return date;
      })(),
      dateTo: getCurrentDate()
    };

    this._colorsCart = null;
    this._daysChart = null;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._colorsCart !== null || this._daysChart !== null) {
      this._colorsCart = null;
      this._daysChart = null;
    }

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    this._setDatepicker();
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo
    });
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
        this.getElement().querySelector(`.statistic__period-input`),
        {
          mode: `range`,
          dateFormat: `j F`,
          defaultDate: [this._data.dateFrom, this._data.dateTo],
          onChange: this._dateChangeHandler
        }
    );
  }

  _setCharts() {
    if (this._colorsCart !== null || this._daysChart !== null) {
      this._colorsCart = null;
      this._daysChart = null;
    }

    const {tasks, dateFrom, dateTo} = this._data;
    const colorsCtx = this.getElement().querySelector(`.statistic__colors`);
    const daysCtx = this.getElement().querySelector(`.statistic__days`);

    this._colorsCart = renderColorsChart(colorsCtx, tasks);
    this._daysChart = renderDaysChart(daysCtx, tasks, dateFrom, dateTo);
  }
}
