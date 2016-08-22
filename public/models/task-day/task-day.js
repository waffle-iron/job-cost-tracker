import can from 'can';
import tag from 'can-connect/can/tag/';
import superMap from 'job-tracker/models/superMap';
import 'can/map/define/define';
import isNumber from 'lodash/lang/isNumber';
import Task from 'job-tracker/models/task/';
import moment from 'moment';

function diffValue(val1, val2) {
  let v1 = Number(val1 || 0);
  let v2 = Number(val2 || 0);
  if (isNumber(v1) && isNumber(v2)) {
    return v2 - v1;
  }
  return null;
}

export const TaskDay = can.Map.extend({
  define: {
    job: { type: undefined },
    notes: { type: 'string', value: '' },
    completed: {
      type(val){
        return moment(val, moment.ISO_8601);
      },
      serialize(currentVal) {
        if (moment.isMoment(currentVal)) {
          return currentVal.format();
        }
        return currentVal;
      }
    },
    foreman: { type: undefined },
    completedTasks: {
      Type: Task.List,
      value: []
    },
    hours: { type: 'number' },
    allocatedHours: {
      get(){
        return this.attr('totals').hours;
      }
    },
    hoursDiff: {
      get() {
        return diffValue(this.attr('hours'), this.attr('allocatedHours'));
      }
    },

    cubicYards: { type: 'number' },
    allocatedCubicYards: {
      get(){
        return this.attr('totals').cubicYards;
      }
    },
    cubicYardsDiff: {
      get() {
        return diffValue(this.attr('cubicYards'), this.attr('allocatedCubicYards'));
      }
    },

    tons: { type: 'number' },
    allocatedTons: {
      get(){
        return this.attr('totals').tons;
      }
    },
    tonsDiff: {
      get() {
        return diffValue(this.attr('tons'), this.attr('allocatedTons'));
      }
    },
    totals: {
      get() {
        var completed = this.attr('completedTasks'),
            totals = {
              hours: 0,
              cubicYards: 0,
              tons: 0
            };

        completed.each(function(val){
          totals.hours += val.hours;
          totals.cubicYards += val.cubicYards;
          totals.tons += val.tons;
        });

        return totals;
      }
    }
  }
});

TaskDay.List = can.List.extend({
  Map: TaskDay
}, {
});

export const taskDayConnection = superMap({
  parseListData: function(data){
    data.current = Math.floor(data.skip / data.limit) + 1;
    data.pages = Math.ceil(data.total / data.limit);
    return data;
  },
  url: {
    getListData: "GET /api/task-days?$populate[]=completedTasks&$populate[]=lot&$populate[]=foreman&$populate[]=job",
    getData: "GET /api/task-days/{id}/?$populate[]=completedTasks&$populate[]=lot&$populate[]=foreman&$populate[]=job",
    createData: "POST /api/task-days",
    updateData: function(taskDay){
      var def = can.Deferred();

      //extract ids
      taskDay.foreman = taskDay.foreman.id || taskDay.foreman;
      taskDay.job = taskDay.job.id || taskDay.job;
      taskDay.completedTasks = taskDay.completedTasks.map(function(td){
        return td.id;
      });

      // force can.connect to re-fetch a whole instance
      // so they are properly hydrated
      can.ajax({
        processData: false,
        url: '/api/task-days/' + taskDay.id,
        method: 'PUT',
        data: JSON.stringify(taskDay),
        contentType: 'application/json'
      }).then((result) => {
        TaskDay.get({id: result.id}).then((taskDay) => {
          def.resolve(taskDay);
        });
      });

      return def;
    },
    destroyData: function(taskDay){
      return can.ajax({
        url: "/api/task-days/" + taskDay.id,
        method: "DELETE"
      });
    }
  },
  Map: TaskDay,
  List: TaskDay.List,
  name: 'taskDay'
});

tag('task-day-model', taskDayConnection);

export default TaskDay;
