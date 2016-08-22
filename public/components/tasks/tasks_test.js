import QUnit from 'steal-qunit';
import { ViewModel } from './tasks';
import Map from 'can/map/';

// ViewModel unit tests
QUnit.module('job-tracker/components/tasks', function(){
  QUnit.test('Is a can.Map', function(assert){
    var vm = new ViewModel();
    assert.ok(vm instanceof Map);
  });
});
