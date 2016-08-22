import QUnit from 'steal-qunit';
import { ViewModel } from './job-reports';
import can from 'can';

// ViewModel unit tests
QUnit.module('job-tracker/components/job-reports', function(){

  QUnit.test('viewModel is a can.Map', function(assert){
    var vm = new ViewModel();
    assert.ok(vm instanceof can.Map, 'View Model is an instance of can.Map');
  });

});
