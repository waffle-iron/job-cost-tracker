import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './custom-work-order.less!';
import template from './custom-work-order.stache!';
import Task from 'job-tracker/models/task/';
import Job from 'job-tracker/models/job/';
import Lot from 'job-tracker/models/lot/';

export const ViewModel = Map.extend({
  define: {
    task: {
      Type: Task,
      // prevent weird bug where it re-renders component
      // when values are initially changed
      value: {
        name: '',
        hours: 0,
        cubicYards: 0,
        tons: 0,
        notes: ''
      }
    },
    lotId: {
      value: ''
    },
    jobId: {
      value: ''
    },
    saving: {
      value: false
    }
  },
  submitOrder() {
    this.attr('task').attr({
      lot: this.attr('lotId'),
      job: this.attr('jobId')
    });

    this.attr('saving',
      this.attr('task').save()
    );

    this.attr('task', new Task({}));
    this.attr('jobId', '');
    this.attr('lotId', '');
  }
});

export default Component.extend({
  tag: 'custom-work-order',
  viewModel: ViewModel,
  template,
  events: {
    'form.custom-work-order-form submit': function(el, ev){
      ev.preventDefault();
      this.viewModel.submitOrder();
    }
  }
});
