import can from 'can';
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './task-day.stache!';
import TaskDay from 'job-tracker/models/task-day/';
import moment from 'moment';
import Pikaday from 'pikaday';
import _ from 'lodash';

export const ViewModel = Map.extend({
  define: {
    taskDays: {
      value: function(){
        return TaskDay.getList({
          '$sort': {'createdAt': -1}
        });
      }
    },
    skip: {
      value: 0
    },
    sortBy: {
      value: 'createdAt'
    },
    sortAsc: {
      value: false
    },
    jobFilter: {
      value: ''
    },
    totals: {
      get(){
        var taskDays = this.attr('taskDays'),
            totals = {
              cubicYards: 0,
              tons: 0,
              hours: 0,
              allocatedHours: 0,
              allocatedCubicYards: 0,
              allocatedTons: 0,
              hoursDiff: 0,
              cubicYardsDiff: 0,
              tonsDiff: 0
            };

        return taskDays.then((result) => {
          result.each(function(taskDay){
            can.each(totals, (val, key) => {
              totals[key] += taskDay.attr(key);
            });
          });

          return totals;
        });
      }
    },
    sort: {
      value: 'date'
    },
    date: {
      value: ''
    },
    selectedJob: {
      value: ''
    },
    foremanFilter: {
      value: ''
    },
    selectedForeman: {
      value: ''
    },
    hasFilters: {
      get() {
        return this.attr('jobFilter') || this.attr('foremanFilter') || this.attr('date');
      }
    },
    columns: {
      value: [{
        key: 'completed',
        label: 'Date',
        sort: 'completed'
      }, {
        key: 'job',
        label: 'Job'
      }, {
        key: 'foreman',
        label: 'Foreman'
      }, {
        key: 'notes',
        label: 'Notes'
      }, {
        key: 'completedTasks',
        label: 'Tasks'
      }, {
        key: 'hours',
        label: 'Actual Hours',
        sort: 'hours'
      },{
        key: 'allocatedHours',
        label: 'Allocated Hours'
      },{
        key: 'hoursDiff',
        label: 'Hours Diff'
      },{
        key: 'cubicYards',
        label: 'Actual CY',
        sort: 'cubicYards'
      }, {
        key: 'allocatedCubicYards',
        label: 'Allocated CY'
      },{
        key: 'cubicYardsDiff',
        label: 'CY Diff'
      }, {
        key: 'tons',
        label: 'Actual Tons',
        sort: 'tons'
      },{
        key: 'allocatedTons',
        label: 'Allocated Tons'
      },{
        key: 'tonsDiff',
        label: 'Tons Diff'
      }]
    }
  },
  updateSort(next, prev){
    if(next && prev){
      if(next !== prev){
        this.attr('sortBy', next);
        this.attr('sortAsc', true);
      }else{
        this.attr('sortAsc', !this.attr('sortAsc'));
      }

      this.filterTaskDays();
    }
  },
  prevPage(skip, limit){
    if(skip !== 0){
      this.attr('skip', skip - limit < 0 ? 0 : skip - limit);
      this.filterTaskDays();
    }
  },
  nextPage(skip, limit, total){
    if(skip + limit < total){
      this.attr('skip', skip + limit);
      this.filterTaskDays();
    }
  },
  filterTaskDays() {
    var query = {"$search": {}, '$skip': this.attr('skip'), '$sort': {}},
        job = this.attr('selectedJob'),
        foreman = this.attr('selectedForeman'),
        jobSearch = this.attr('jobFilter'),
        foremanSearch = this.attr('foremanFilter'),
        date = this.attr('date');

      query['$sort'][this.attr('sortBy')] = this.attr('sortAsc') ? 1 : -1;

      if(job){
        query.job = job.attr('id');
      }else if(jobSearch){
        query.$search['job.name'] = jobSearch;
      }

      if(foreman){
        query.foreman = foreman.attr('id');
      }else if(foremanSearch){
        query.$search['foreman.name'] = foremanSearch;
      }

      if(date){
        query.completed = moment.utc(date, 'MM/DD/YYYY').format();
      }

      if(!(jobSearch || foremanSearch)){
        delete query['$search'];
      }

      this.attr('taskDays', TaskDay.getList(query));
    },
  formatDisplay(model, key) {
    let formatter = {
      'completed': this.formatDateDisplay,
      'completedTasks': this.formatTasks,
      'job': this.formatMapWithName,
      'foreman': this.formatMapWithName,
      'hoursDiff': this.formatDiff,
      'cubicYardsDiff': this.formatDiff,
      'tonsDiff': this.formatDiff,
      'allocatedHours': this.formatAllocated,
      'allocatedCubicYards': this.formatAllocated,
      'allocatedTons': this.formatAllocated
    }[key];
    if (formatter) {
      return formatter(model, key);
    }
    return model.attr(key);
  },
  formatAllocated(model, key) {
    let num = model.attr(key);
    if(num){
      return _.round(num, 2);
    }

    return '';
  },
  formatDateDisplay(model, key) {
    let date = model.attr(key);
    if (date) {
      return moment(date).utc().format('MM/DD/YYYY');
    }
    return '';
  },
  formatMapWithName(model, key) {
    let map = model.attr(key);
    if (map instanceof Map) {
      return map.attr('name');
    }
    return '';
  },
  formatTasks(model, key) {
    return model.attr(key).map(task => {
      if(task.attr){
        return can.capitalize(task.attr('name'));
      }
    }).join(", ");
  },
  formatDiff(model, key) {
    let n = model.attr(key);
    return (n > 0 ? "+" : "") + _.round(n, 2);
  }
});

export default Component.extend({
  tag: 'task-day',
  viewModel: ViewModel,
  template,
  events: {
    inserted(el, ev) {
      this.datepicker = new Pikaday({
        field: el.find('#date-picker')[0],
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2030, 12, 31),
        yearRange: [2000, 2030],
        format: 'MM/DD/YYYY'
      });
    },
    '.filter-form submit': function(el, ev){
      ev.preventDefault();
      this.viewModel.filterTaskDays();
    },
    '.filter-form reset': function(){
      this.viewModel.attr({
        jobFilter: '',
        foremanFilter: '',
        date: ''
      });
      this.viewModel.filterTaskDays();
    }
  }
});
