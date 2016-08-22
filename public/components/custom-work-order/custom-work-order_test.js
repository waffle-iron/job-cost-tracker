import QUnit from 'steal-qunit';
import { ViewModel } from './custom-work-order';

// ViewModel unit tests
QUnit.module('job-tracker/components/custom-work-order');

QUnit.test('Empty job Id', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('jobId'), '');
});
