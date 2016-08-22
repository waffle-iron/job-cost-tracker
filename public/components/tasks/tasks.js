import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './tasks.stache!';
import Task from 'job-tracker/models/task/';
import moment from 'moment';

export const ViewModel = Map.extend({
  define: {
    tasks: {
      value() {
        return Task.getList({
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
    selectedJob: {
      value: ''
    },
    lotFilter: {
      value: ''
    },
    selectedLot: {
      value: ''
    },
    hasFilters: {
      get() {
        return this.attr('jobFilter') || this.attr('lotFilter');
      }
    },
    columns: {
      value: [{
        key: 'completed',
        label: 'Completed',
        sort: 'completed'
      },
      {
        key: 'job',
        label: 'Job'
      }, {
        key: 'lot',
        label: 'Lot',
        sort: 'lot'
      }, {
        key: 'name',
        label: 'Task',
        sort: 'name'
      }, {
        key: 'notes',
        label: 'Notes'
      }, {
        key: 'hours',
        label: 'Allocated Hours',
        sort: 'hours'
      }, {
        key: 'cubicYards',
        label: 'Allocated CY',
        sort: 'cubicYards'
      }, {
        key: 'tons',
        label: 'Allocated Ton',
        sort: 'tons'
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
    }

    this.filterTasks();
  },
  prevPage(skip, limit){
    if(skip !== 0){
      this.attr('skip', skip - limit < 0 ? 0 : skip - limit);
      this.filterTasks();
    }
  },
  nextPage(skip, limit, total){
    if(skip + limit < total){
      this.attr('skip', skip + limit);
      this.filterTasks();
    }
  },
  filterTasks() {
    var query = {"$search": {}, '$skip': this.attr('skip'), '$sort': {}},
        job = this.attr('selectedJob'),
        lot = this.attr('selectedLot'),
        jobSearch = this.attr('jobFilter'),
        lotSearch = this.attr('lotFilter');

    query['$sort'][this.attr('sortBy')] = this.attr('sortAsc') ? 1 : -1;

    if(job){
      query.job = job.attr('id');
    }else if(jobSearch){
      query.$search['job.name'] = jobSearch;
    }

    if(lot){
      query.lot = lot.attr('id');
    }else if(lotSearch){
      query.$search['lot.lotNumber'] = lotSearch;
    }

    if(!(jobSearch || lotSearch)){
      delete query['$search'];
    }

    this.attr('tasks', Task.getList(query));
  },
  formatDisplay(model, key) {
    var format = {
            completed: function(date){
              return moment(date).utc().format('MM/DD/YYYY');
            },
            lot: function(lot){
              return lot.attr('lotNumber') +
                      ( lot.attr('name') ? ' - ' + lot.attr('name') : '' );
            },
            job: function(job){
              return job.attr('name');
            }
          },
        val = model.attr(key);

    return val && format[key] ? format[key](val) : val;
  }
});

export default Component.extend({
  tag: 'tasks',
  viewModel: ViewModel,
  template,
  events: {
    '.filter-form submit': function(el, ev){
      ev.preventDefault();
      this.viewModel.filterTasks();
    },
    '.filter-form reset': function(){
      this.viewModel.attr({
        jobFilter: '',
        lotFilter: ''
      });
      this.viewModel.filterTasks();
    }
  }
});
