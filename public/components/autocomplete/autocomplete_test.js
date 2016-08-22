import QUnit from 'steal-qunit';
import { ViewModel } from './autocomplete';

// ViewModel unit tests
QUnit.module('job-tracker/components/autocomplete', function(){

	QUnit.module('ViewModel', function(){

		QUnit.test('selectItem', function(){
			var vm = new ViewModel();

			vm.selectItem('hello');
			QUnit.equal(vm.attr('value'), 'hello', 'updates value');

			vm.selectItem('goodbye', {message: 'goodbye'});
			QUnit.equal(vm.attr('value'), 'goodbye', 'updates text value');
			QUnit.deepEqual(vm.attr('selected').attr(), {message: 'goodbye'}, 'updates selected');
		});
	});

	QUnit.module('Component', function(){


		QUnit.skip('focus and dropdown display', function(){
			// TODO
			
			// display when getting focus if list has items
			
			// hide when focus leaves whole component
			
			// don't hide when tabbing to list item
		});

		QUnit.skip('select item', function(){
			// TODO
			
			// on select item, update field value
			
			// update viewmodel
			
			// event is fired
		});

		QUnit.skip('text-only content', function(){
			// TODO
			
			// on select, lastSelected is text
		});

		QUnit.skip('HTML Content', function(){
			// TODO
			
			// data-value without attr data
			
			// data-value with attr data
		});
	});
});
