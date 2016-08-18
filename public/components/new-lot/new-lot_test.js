import QUnit from 'steal-qunit';
import { ViewModel } from './new-lot';
import can from 'can';

// ViewModel unit tests
QUnit.module('<new-lot> Component', function() {

  QUnit.module('ViewModel', {
    beforeEach() {
      this.vm = new ViewModel();
    }
  }, function() {

    QUnit.test('is a can.Map', function(assert){
      var vm = this.vm;
      assert.ok(vm instanceof can.Map, 'View Component is a can.Map');
    });

  });

});
