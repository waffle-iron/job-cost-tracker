import QUnit from 'steal-qunit';
import { ViewModel } from './date-range-picker';
import can from 'can';

// ViewModel unit tests
QUnit.module('job-tracker/components/date-range-picker', function() {

  QUnit.test('viewModel is an instance of can.Map', function(assert){
    var vm = new ViewModel();
    assert.ok(vm instanceof can.Map, 'date-range-picker viewmodel is a can.Map');
  });

});
