import QUnit from 'steal-qunit';
import Lot from './lot';
import Map from 'can/map/';

QUnit.module('models/lot', function() {

  QUnit.test('is an instance of can.Map', function(assert){
    assert.ok(new Lot() instanceof Map, 'is an instance of can.Map');
  });

});
