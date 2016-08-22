import can from 'can';
import superMap from 'job-tracker/models/superMap';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';
import Job from 'job-tracker/models/job/';
import Lot from 'job-tracker/models/lot/';

export const Task = can.Map.extend({
  define: {
    name: { type: 'string' },
    hours: { type: 'number' },
    cubicYards: { type: 'number' },
    tons: { type: 'number' },
    notes: { type: 'string' },
    completed: { type: 'date' },
    Job: { Type: Job },
    Lot: { Type: Lot }
  }
});

Task.List = can.List.extend({
  Map: Task
}, {
  totals: function(){
    var totals = {
      cubicYards: 0,
      tons: 0,
      hours: 0
    };

    this.each(function(task){
      totals.cubicYards += task.attr('cubicYards');
      totals.tons += task.attr('tons');
      totals.hours += task.attr('hours');
    });

    return totals;
  }
});

export const taskConnection = superMap({
  parseListData: function(data){
    data.current = Math.floor(data.skip / data.limit) + 1;
    data.pages = Math.ceil(data.total / data.limit);
    return data;
  },
  url: {
    getListData: function(data){
      return can.ajax({
        url: "/api/tasks?$populate[]=job&$populate[]=lot",
        method: "GET",
        data: data
      });
    },
    getData: function(data){
      var id = data.id;

      delete data.id;

      return can.ajax({
        url: "/api/tasks/" + id + "?$populate[]=job&$populate[]=lot",
        method: "GET",
        data: data
      });
    },
    createData: function(tasks) {
      var def = can.Deferred();

      can.ajax({
        url: "/api/tasks",
        method: "POST",
        data: tasks
      }).then(result => {
        // fix #101
        Task.get({id: result.id}).then(task => {
          def.resolve(task);
        });
      });

      return def;
    },
    updateData: function(task){
      var def = can.Deferred();

      //extract ids
      task.lot = task.lot.id || task.lot;
      task.job = task.job.id || task.job;

      // force can.connect to re-fetch a whole instance
      // so they are properly hydrated
      can.ajax({
        url: '/api/tasks/' + task.id,
        method: 'PUT',
        data: task
      }).then((result) => {
        Task.get({id: result.id}).then((task) => {
          def.resolve(task);
        });
      });

      return def;
    },
    destroyData: function(task){
      return can.ajax({
        url: "/api/tasks/" + task.id,
        method: "DELETE"
      });
    }
  },
  Map: Task,
  List: Task.List,
  name: 'task'
});

tag('task-model', taskConnection);

export default Task;
