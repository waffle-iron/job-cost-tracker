import QUnit from 'steal-qunit';
import { ViewModel } from './dynamic-grid';
import Map from 'can/map/';

// ViewModel unit tests
QUnit.module('job-tracker/components/dynamic-grid', function(){
  QUnit.test('Is a can.Map', function(assert){
    var vm = new ViewModel();
    assert.ok(vm instanceof Map);
  });
});
