import QUnit from 'steal-qunit';
import Foreman from './foreman';

QUnit.module('models/foreman');

QUnit.test('getList', function(){
  stop();
  Foreman.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.attr('0.name'), 'Solomon Grundy');
    start();
  });
});
