import QUnit from 'steal-qunit';
import Map from 'can/map/';
import { ViewModel } from './user-manager';

// ViewModel unit tests
QUnit.module('rss-job-tracker/components/user-manager');

QUnit.test('ViewModel is a can.Map', function(){
  var vm = new ViewModel();
  QUnit.ok(vm instanceof Map, 'ViewModel is an instanceof can.Map');
});
