import QUnit from 'steal-qunit';
import { ViewModel } from './app-nav';

// ViewModel unit tests
QUnit.module('job-tracker/components/app-nav');

QUnit.test('Has links', function(assert){
  var vm = new ViewModel();
  assert.ok(vm.attr('links'), 'Has a links attribute');
});
