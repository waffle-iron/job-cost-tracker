import can from 'can';
import Component from 'can/component/';
import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';
import './dynamic-grid.less!';
import template from './dynamic-grid.stache!';
import _ from 'lodash';

import valueTemplate from './templates/value.stache!';
import cellTemplate from './templates/cell.stache!';
import rowTemplate from './templates/row.stache!';
import headerRowTemplate from './templates/headerRow.stache!';
import bodyTemplate from './templates/body.stache!';
import totalRowTemplate from './templates/totalRow.stache!';

can.view.preloadStringRenderer('valueTemplate', valueTemplate);
can.view.preloadStringRenderer('cellTemplate', cellTemplate);
can.view.preloadStringRenderer('rowTemplate', rowTemplate);
can.view.preloadStringRenderer('headerRowTemplate', headerRowTemplate);
can.view.preloadStringRenderer('bodyTemplate', bodyTemplate);
can.view.preloadStringRenderer('totalRow', totalRowTemplate);

export const ViewModel = Map.extend({
  define: {
    // attribute
    modelList: {
      value: [],
      set(newVal){
        /*
         * Force the can.Model into a can.List so
         * it doesn't try to do anything fancy
         * when we edit cells.
         */
        return new can.List(newVal);
      }
    },
    // attribute
    noResultsText: {
      type: 'string',
      value: 'No Results'
    },
    // attribute
    columns: {
      value: []
    },
    rowData: {
      get() {
        return this.attr('modelList');
      }
    },
    headerRows: {
      value: [{
        _classes: 'primary-row'
      }]
    },
    isDataEmpty: {
      get: function() {
        return this.attr('rowData.length') === 0;
      }
    },
    totals: {
      set(newVal, setVal){
        if(newVal.then){
          newVal.then(setVal);
        }else{
          return newVal;
        }
      }
    },
    totalData: {
      get() {
        var columns = this.attr('columns').map((val) => {return val.key;}),
            totals = this.attr('totals');

        if(totals){
          return _.sortBy(totals.attr ? totals.attr() : totals, (total, index) => {
            return columns.indexOf(index);
          });
        }
        return [];
      }
    }
  },
  getModel(ctx, tree){
    return tree._parent._context;
  },
  getValue(ctx, tree) {
    let model = tree._parent._context;
    let key = ctx.attr('key');
    let displayTransform = this.attr('displayTransform');
    if (displayTransform) {
      return displayTransform(model, key);
    }
    return model.attr(key);
  },
  update(model, key){
    model.save();
  },
  deleteModel(model){
    var list = this.attr('modelList');
    list.splice(list.indexOf(model), 1);
    model.destroy();
  }
});

export default Component.extend({
  tag: 'dynamic-grid',
  viewModel: ViewModel,
  template,
  helpers: {
    totalPadding(options) {
      var padding = this.attr('columns.length') - this.attr('totalData').length - 1,
          out = [];

      for(var i = 0; i < padding; i++){
        out.push(options.fn());
      }

      return out;
    },
    round(num, significance) {
      return _.round(num, significance || 2);
    }
  }
});
