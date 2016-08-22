import Component from 'can/component/';
import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';
import './new-task-day.less!';
import template from './new-task-day.stache!';
import TaskDay from 'job-tracker/models/task-day/';
import Foreman from 'job-tracker/models/foreman/';
import Job from 'job-tracker/models/job/';
import Pikaday from 'pikaday';
import moment from 'moment';

export const ViewModel = Map.extend({
  define: {
    taskDayHours: {
      type: 'number',
      value: 0
    },
    taskDayCubicYards: {
      type: 'number',
      value: 0
    },
    taskDayTons: {
      type: 'number',
      value: 0
    },
    taskDayNotes: {
      type: 'string',
      value: ''
    },
    foreman: {
      value: ''
    },
    foremen: {
      value() {
        return Foreman.getList({});
      }
    },
    job: {
      Type: Job
    },
    selectedTasks: {
      Value: List
    },
    taskDayCompleted: {
      type: 'string'
    },
    jobId: {
      value: '',
      set(newVal) {
        if (newVal) {
          Job.findOne({
            id: newVal
          }).then((job) => {
            this.attr('job', job);
          });
        }
        return newVal;
      }
    },
    foremanIsNew: {
      get() {
        return this.attr('foreman') === "___new___";
      }
    },
    error: {
      set(newVal) {
        if (newVal) {
          clearTimeout(this.attr('errorTimer'));
          let timerId = setTimeout(_ => {
            this.attr('error', null);
          }, 5000);
          this.attr('errorTimer', timerId);
        }
        return newVal;
      }
    },
    success: {
      set(newVal) {
        if (newVal) {
          clearTimeout(this.attr('successTimer'));
          let timerId = setTimeout(_ => {
            this.attr('success', null);
          }, 5000);
          this.attr('successTimer', timerId);
        }
        return newVal;
      }
    }
  },
  submitTaskDay() {
    //???: have to do this for some reason, bug with jQuery to Promise? babel?
    let vm = this;
    this.attr('saving', true);

    return new Promise((resolve, reject) => {
        try {
          let errors = {};
          if (!this.attr('taskDayCompleted')) {
            errors['Date'] = 'Completed date Required';
          }
          let completed = moment.utc(this.attr('taskDayCompleted'), 'MM/DD/YYYY');
          if (!completed.isValid) {
            errors['Date'] = 'Completed date is not valid';
          }
          let completedTasks = this.attr('selectedTasks').map(function(sel) {
            return sel.attr('task.id');
          });

          let taskDay = new TaskDay({
            completed: completed,
            completedTasks: completedTasks,
            job: this.attr('jobId'),
            tons: this.attr('taskDayTons'),
            cubicYards: this.attr('taskDayCubicYards'),
            hours: this.attr('taskDayHours'),
            notes: this.attr('taskDayNotes')
          });

          if (this.attr('foremanIsNew')) {
            taskDay.attr('foreman', {
              name: this.attr('foremanName')
            });
          } else {
            taskDay.attr('foreman', this.attr('foreman'));
          }

          if (Object.keys(errors).length === 0) {
            return resolve(taskDay);
          }

          reject({
            message: "Task validation failed",
            errors: errors
          });
        } catch (err) {
          reject(err);
        }
      })
      .then(taskDay => {
        return new Promise((resolve, reject) => {
          return taskDay.save()
            .then(resolve, r => {
              reject(r.responseJSON);
            });
        });
      })
      .then(result => {
        vm.attr({
          taskDayHours: 0,
          taskDayTons: 0,
          taskDayCubicYards: 0,
          taskDayNotes: ''
        });
        vm.attr('selectedTasks').replace([]);
        if (vm.attr('foremanIsNew')) {
          return Foreman.getList({})
            .then(foremen => {
              vm.attr('foremen', Promise.resolve(foremen));
              vm.attr('foreman', result.attr('foreman'));
              vm.attr('success', true);
              return true;
            }, err => {
              vm.attr('foreman', '');
              throw err;
            });
        }
        vm.attr('success', true);
        return true;
      })
      .catch(err => {
        this.attr('error', err);
        return false;
      })
      .then((saved) => {
        this.attr('saving', false);
      });
  }
});

export default Component.extend({
  tag: 'new-task-day',
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
    removed(el, ev) {
      this.datepicker.destroy();
    },
    'form submit': function(el, ev) {
      ev.preventDefault();
      this.viewModel.submitTaskDay();
    }
  }
});
