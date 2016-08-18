import QUnit from 'steal-qunit';
import User from './user';
import '../fixtures/user';

QUnit.module('models/user');

QUnit.test('getList', function(assert){
  let done = assert.async();
  User.getList().then(function(items) {
    QUnit.equal(items.length, 8);
    QUnit.equal(items.attr('0.email'), 'adam@bitovi.com');
    done();
  });
});
