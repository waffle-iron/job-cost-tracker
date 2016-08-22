import QUnit from 'steal-qunit';
import { ViewModel } from './tasks-completed';

// ViewModel unit tests
QUnit.module('job-tracker/components/new-task-day/tasks-completed');

QUnit.skip('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the tasks-completed component');
});
