import F from 'funcunit';
import QUnit from 'steal-qunit';
import 'job-tracker/models/fixtures/';

F.attach(QUnit);

QUnit.module('uses modern QUnit style', {
  beforeEach: function() {
    this.beforeValueOnContext = true;
  }
}, function() {

  QUnit.test('runs nested it\'s propery', function(assert){
    assert.ok(this.beforeValueOnContext);
  });

});

// QUnit.module('job-tracker functional smoke test', {
//   beforeEach() {
//     F.open('../development.html');
//   }
// });
//
// QUnit.test('job-tracker main page shows up', function() {
//   F('title').text('job-tracker', 'Title is set');
// });
