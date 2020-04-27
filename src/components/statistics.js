import AbstractSmartComponent from "./abstract-smart-component.js";
import {isOneDay} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import flatpickr from "flatpickr";

const colorToHex = {
  black: `#000000`,
  blue: `#0c5cdd`,
  green: `#31b55c`,
  pink: `#ff3cb9`,
  yellow: `#ffe125`,
};

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const getTasksByDateRange = (tasks, dateFrom, dateTo) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    return dueDate >= dateFrom && dueDate <= dateTo;
  });
};

const createPlaceholder = (dateFrom, dateTo) => {
  const format = (date) => {
    return moment(date).format(`DD MMM`);
  };

  return `${format(dateFrom)} - ${format(dateTo)}`;
};

const calcUniqCountColor = (tasks, color) => {
  return tasks.filter((it) => it.color === color).length;
};

const calculateBetweenDates = (from, to) => {
  const result = [];
  let date = new Date(from);

  while (date <= to) {
    result.push(date);

    date = new Date(date);
    date.setDate(date.getDate() + 1);
  }

  return result;
};

const renderColorsChart = (colorsCtx, tasks) => {
  const colors = tasks
    .map((task) => task.color)
    .filter(getUniqItems);

  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: colors,
      datasets: [{
        data: colors.map((color) => calcUniqCountColor(tasks, color)),
        backgroundColor: colors.map((color) => colorToHex[color])
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
  const days = calculateBetweenDates(dateFrom, dateTo);

  const taskCountOnDay = days.map((date) => {
    return tasks.filter((task) => {
      return isOneDay(task.dueDate, date);
    }).length;
  });

  const formattedDates = days.map((it) => moment(it).format(`DD MMM`));

  return new Chart(daysCtx, {
    plugins: [ChartDataLabels],
    type: `line`,
    data: {
      labels: formattedDates,
      datasets: [{
        data: taskCountOnDay,
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

const createStatisticsTemplate = ({tasks, dateFrom, dateTo}) => {
  const placeholder = createPlaceholder(dateFrom, dateTo);
  const tasksCount = getTasksByDateRange(tasks, dateFrom, dateTo).length;
  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input class="statistic__period-input" type="text" placeholder="${placeholder}">
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">${tasksCount}</span> tasks were fulfilled.
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
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor({tasks, dateFrom, dateTo}) {
    super();

    this._tasks = tasks;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    this._daysChart = null;
    this._colorsChart = null;

    this._applyFlatpickr(this.getElement().querySelector(`.statistic__period-input`));

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate({tasks: this._tasks.getTasks(), dateFrom: this._dateFrom, dateTo: this._dateTo});
  }

  show() {
    super.show();

    this.rerender(this._tasks, this._dateFrom, this._dateTo);
  }

  recoveryListeners() {}

  rerender(tasks, dateFrom, dateTo) {
    this._tasks = tasks;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    this._applyFlatpickr(this.getElement().querySelector(`.statistic__period-input`));

    const daysCtx = element.querySelector(`.statistic__days`);
    const colorsCtx = element.querySelector(`.statistic__colors`);

    this._resetCharts();

    this._daysChart = renderDaysChart(daysCtx, this._tasks.getTasks(), this._dateFrom, this._dateTo);
    this._colorsChart = renderColorsChart(colorsCtx, this._tasks.getTasks());
  }

  _resetCharts() {
    if (this._daysChart) {
      this._daysChart.destroy();
      this._daysChart = null;
    }

    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }
  }

  _applyFlatpickr(element) {
    if (this._flatpickr) {
      this._flatpickr.destroy();
    }

    this._flatpickr = flatpickr(element, {
      altInput: true,
      allowInput: true,
      defaultDate: [this._dateFrom, this._dateTo],
      mode: `range`,
      onChange: (dates) => {
        if (dates.length === 2) {
          this.rerender(this._tasks, dates[0], dates[1]);
        }
      }
    });
  }
}
