import QUnit from 'steal-qunit';
import TaskDay from './task-day';

QUnit.module('models/task-day', function() {

  QUnit.test('getList', function(assert) {
    let done = assert.async();
    TaskDay.getList().then(function(items) {
      assert.equal(items.length, 3, 'There are 4 items retrieved');
      assert.equal(items.attr('0.notes'), 'Some notes for the NEW day', 'The first item is for Jan 18 2016');
      done();
    });
  });

});
