import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './date-range-picker.less!';
import template from './date-range-picker.stache!';
import Pikaday from 'pikaday';

export const ViewModel = Map.extend({
  define: {
    startDate: {
      value: null
    },
    endDate: {
      value: null
    }
  }
});

export default Component.extend({
  tag: 'date-range-picker',
  viewModel: ViewModel,
  template,
  events: {
    inserted(el, ev) {
      this.startpicker = new Pikaday({
        field: el.find('.report-date-start')[0],
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2030, 12, 31),
        yearRange: [2000, 2030],
        format: 'MM/DD/YYYY'
      });
      this.endpicker = new Pikaday({
        field: el.find('.report-date-end')[0],
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2030, 12, 31),
        yearRange: [2000, 2030],
        format: 'MM/DD/YYYY'
      });
    },
    removed(el, ev) {
      this.startpicker.destroy();
      this.endpicker.destroy();
    }
  }
});
