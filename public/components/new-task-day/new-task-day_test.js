import QUnit from 'steal-qunit';
import { ViewModel } from './new-task-day';

// ViewModel unit tests
QUnit.module('job-tracker/components/new-task-day');

QUnit.skip('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the new-task-day component');
});
