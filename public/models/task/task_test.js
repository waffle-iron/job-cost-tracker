import QUnit from 'steal-qunit';
import Task from './task';

QUnit.module('models/task');

QUnit.test('getList', function(){
  stop();
  Task.getList().then(function(items) {
    QUnit.equal(items.length, 9);
    QUnit.equal(items.attr('0.name'), 'Driveway');
    start();
  });
});
