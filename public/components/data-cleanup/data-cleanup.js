import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './data-cleanup.less!';
import template from './data-cleanup.stache!';
import moment from 'moment';

export const ViewModel = Map.extend({
  define: {
    message: {
      value: 'This is the data-cleanup component'
    }
  }
});

export default Component.extend({
  tag: 'data-cleanup',
  viewModel: ViewModel,
  template,
  helpers: {
  	formatDate(date) {
  		return moment(date()).format('MM/DD/YYYY');
  	}
  }
});