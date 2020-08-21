import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view.js';
import {countCompletedTaskInDateRange} from '../utils/statistics.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const renderColorsChart = (colorsCtx, tasks) => {
  // Функция для отрисовки графика по цветам
};

const renderDaysChart = (daysCtx, tasks, dateFrom, dateTo) => {
  // Функция для отрисовки графика по датам
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

export default class StatisticsView extends SmartView {
  #datepicker = null;
  #colorsChart = null;
  #daysChart = null;

  constructor(tasks) {
    super();

    this._data = {
      tasks,
      // По условиям техзадания по умолчанию интервал - неделя от текущей даты
      dateFrom: dayjs().subtract(6, 'day').toDate(),
      dateTo: dayjs().toDate(),
    };

    this.#setCharts();
    this.#setDatepicker();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#colorsChart) {
      this.#colorsChart.destroy();
      this.#colorsChart = null;
    }

    if (this.#daysChart) {
      this.#daysChart.destroy();
      this.#daysChart = null;
    }

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }


  restoreHandlers = () => {
    this.#setCharts();
    this.#setDatepicker();
  }

  #dateChangeHandler = ([dateFrom, dateTo]) => {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
    });
  }

  #setDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.statistic__period-input'),
      {
        mode: 'range',
        dateFormat: 'j F',
        defaultDate: [this._data.dateFrom, this._data.dateTo],
        onChange: this.#dateChangeHandler,
      },
    );
  }

  #setCharts = () => {
    const {tasks, dateFrom, dateTo} = this._data;
    const colorsCtx = this.element.querySelector('.statistic__colors');
    const daysCtx = this.element.querySelector('.statistic__days');

    this.#colorsChart = renderColorsChart(colorsCtx, tasks);
    this.#daysChart = renderDaysChart(daysCtx, tasks, dateFrom, dateTo);
  }
}
