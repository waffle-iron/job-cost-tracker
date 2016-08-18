import F from 'funcunit';
import QUnit from 'steal-qunit';
import 'rss-job-tracker/models/fixtures/';

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

// QUnit.module('rss-job-tracker functional smoke test', {
//   beforeEach() {
//     F.open('../development.html');
//   }
// });
//
// QUnit.test('rss-job-tracker main page shows up', function() {
//   F('title').text('rss-job-tracker', 'Title is set');
// });
