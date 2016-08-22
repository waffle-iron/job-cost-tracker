import QUnit from 'steal-qunit';
import { ViewModel } from './data-cleanup';

// ViewModel unit tests
QUnit.module('job-tracker/data-cleanup');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the data-cleanup component');
});
