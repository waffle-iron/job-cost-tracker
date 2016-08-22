import can from 'can/';
import Component from 'can/component/';
import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';
import template from './job-reports.stache!';
import _ from 'lodash';
import Report from 'job-tracker/models/report/';
import moment from 'moment';

export const ViewModel = Map.extend({
  define: {
    reports: {
      value() {
        return Report.getList({});
      }
    },
    totals: {
      get(){
        var reports = this.attr('reports'),
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

        return reports.then((result) => {
          result.each(function(report){
            can.each(totals, (val, key) => {
              totals[key] += report.attr(key);
            });
          });

          return totals;
        });
      }
    },
    jobFilter: {
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
    columns: {
      value: [{
        key: 'job',
        label: 'Job'
      }, {
        key: 'foremen',
        label: 'Foreman'
      },{
        key: 'hours',
        label: 'Actual Hours'
      },{
        key: 'allocatedHours',
        label: 'Allocated Hours'
      },{
        key: 'hoursDiff',
        label: 'Hours Diff'
      },{
        key: 'cubicYards',
        label: 'Actual CY'
      }, {
        key: 'allocatedCubicYards',
        label: 'Allocated CY'
      },{
        key: 'cubicYardsDiff',
        label: 'CY Diff'
      }, {
        key: 'tons',
        label: 'Actual Tons'
      },{
        key: 'allocatedTons',
        label: 'Allocated Tons'
      },{
        key: 'tonsDiff',
        label: 'Tons Diff'
      }]
    }
  },
  formatDisplay(model, key) {
    let formatter = {
      'completed': this.formatDateDisplay,
      'completedTasks': this.formatTasks,
      'job': this.formatMapWithName,
      'foremen': this.formatListWithName,
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
  formatTasks(model, key) {
    return model.attr(key).map(task => {
      if(task.attr){
        return can.capitalize(task.attr('name'));
      }
    }).join(", ");
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
  formatListWithName(model, key) {
    let list = model.attr(key);
    if (list instanceof can.List) {
      return list.map(map => map.attr('name')).join(', ');
    }
    return '';
  },
  formatDiff(model, key) {
    let n = model.attr(key);
    return (n > 0 ? "+" : "") + _.round(n, 2);
  },
  filterReportsByDate(startDate, endDate) {
    var query = {
          "$search": {},
          startdate: startDate ? startDate : undefined,
          enddate: endDate ? endDate : undefined
        },
        job = this.attr('selectedJob'),
        foreman = this.attr('selectedForeman'),
        jobSearch = this.attr('jobFilter'),
        foremanSearch = this.attr('foremanFilter');

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

    if(!(jobSearch || foremanSearch)){
      delete query['$search'];
    }

    this.attr('reports', Report.getList(query));
  }
});

export default Component.extend({
  tag: 'job-reports',
  viewModel: ViewModel,
  template,
  events: {
    '.filter-form submit': function(el, ev){
      ev.preventDefault();
    },
    '.filter-form reset': function(){
      this.viewModel.attr({
        dateRange: {
          startDate: '',
          endDate: ''
        },
        jobFilter: '',
        foremanFilter: ''
      });
      this.viewModel.filterReportsByDate();
    }
  }
});
