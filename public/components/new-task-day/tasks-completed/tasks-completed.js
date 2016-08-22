import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './tasks-completed.less!';
import template from './tasks-completed.stache!';
import Lot from 'job-tracker/models/lot/';
import Task from 'job-tracker/models/task/';

export const ViewModel = Map.extend({
  define: {
  	lots: {
      Type: Lot.List,
      set(newVal){
        this.attr('lot', newVal.attr('0'));
        return newVal;
      }
  	},
    selectedTasks: {
      Value: can.List
    },
  	lotId: {
  		type: 'string',
  		set(newVal, setVal){
  			var lots = this.attr('lots');
  			for(var i = 0, len = lots.attr('length'); i < len; i++){
  				var current = lots.attr(i);
  				if(current.attr('id')===newVal){
  					this.attr('lot', current);
  				}
  			}
  		},
  		get(){
  			return this.attr('lot.id');
  		}
  	},
    lot: {
      value: null
    },
    tasks: {
      get() {
        var tasks = this.attr('lot.tasks');
        return tasks && tasks.filter((task) => {return task.id && task.name && !(task.completed)});
      }
    }
  },
  restoreTask(selectedTask){
  	selectedTask.attr('lot.tasks').push(selectedTask.attr('task'));
  },
  removeTask(index){
   	this.restoreTask(this.attr('selectedTasks').splice(index, 1)[0]);
  },
  undoAddTask(){
  	this.restoreTask(this.attr('selectedTasks').pop());
  },
  selectTask(task){
  	var lot = this.attr('lot'),
  		tasks = lot.attr('tasks'),
      index = tasks.indexOf(task);

  	this.attr('selectedTasks').push({
  		lot: lot,
  		task: tasks.splice(index, 1)[0]
  	});
  }
});

export default Component.extend({
  tag: 'tasks-completed',
  viewModel: ViewModel,
  template,
  events: {
  	'select.task-select mousedown': function(el, ev){
  		ev.preventDefault();
  	}
  }
});
