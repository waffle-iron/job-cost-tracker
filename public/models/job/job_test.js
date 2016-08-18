import QUnit from 'steal-qunit';
import Job from './job';

QUnit.module('models/job');

QUnit.test('getList', function(){
  stop();
  Job.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.attr('0.name'), "Silverwood Heights");
    start();
  });
});
