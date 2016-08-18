import QUnit from 'steal-qunit';
import Report from './report';

QUnit.module('models/report');

QUnit.test('getList', function(){
  stop();
  Report.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.attr('0.description'), 'First item');
    start();
  });
});
