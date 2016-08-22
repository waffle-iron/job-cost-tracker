import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './autocomplete.less!';
import template from './autocomplete.stache!';
import _ from 'lodash';

export const ViewModel = Map.extend({
  define: {
  	value: {
  		value: '',
      set(newVal){
        if(newVal===''){
          this.attr('selected', '');
        }
        return newVal
      }
  	},
    selected: {
      value: ''
    },
  	showAutocomplete: {
  		value: false
  	},
    placeholder: {
      value: ''
    },
    list: {
      set(newVal, setVal){
        if(!newVal){
          //prevent flash on new list fetch
          return this.attr('list');
        }else {
          return newVal;
        }
      }
    }
  },
  selectItem(text, context) {
    var data = {
      value: text,
      selected: context || text
    };

    this.dispatch('selected', data);
    this.attr(data);
  }
});

export default Component.extend({
  tag: 'autocomplete',
  viewModel: ViewModel,
  template,
  events: {
    inserted: function(){
      var element = this.element,
          hide = can.proxy(this.hide, this);

      this.isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if(this.isFF){
        this.ffHandler = function(ev){
          if(!element.find(ev.target).length){
            hide();
          }
        };
        can.bind.call(document, 'focusin', this.ffHandler);
        can.bind.call(document, 'click', this.ffHandler);
      }else{
        this.focusHandler = function(ev){
          if(!element.find(ev.relatedTarget).length){
            hide();
          }
        };
        can.bind.call(this.element, 'focusout', this.focusHandler);
      }
    },
    removed: function(){
      if(this.isFF){
        can.unbind.call(document, 'focus', this.ffHandler);
        can.unbind.call(document, 'click', this.ffHandler);
      }else {
        can.unbind.call(this.element, 'focusout', this.focusHandler);
      }
    },
    'input.autocomplete focus': function(el, ev){
      this.show();
    },
  	'input.autocomplete keyup': function(el, ev){
      this.viewModel.attr('value', el.val());
  	},
  	'.dropdown-menu li a click': function(el, ev){
  		var dataEl = el.find('[data-value]'),
  			context = el.scope().attr('listItem'),
        text;

  		if(el.children().length){
	  		if(dataEl){
	  			var attrVal = dataEl.attr('data-value');
          text = attrVal==="" ? can.trim(dataEl.text()) : attrVal;
	  		}
	  	}else{
	  		text = can.trim(el.text());
	  	}

      this.element.find('.autocomplete')[0].focus();
      this.hide();
      this.viewModel.selectItem(text, context);
  	},
    '.selected keydown': function(el, ev){
      var k = ev.keyCode;
      if(k === 8 || k === 46 || k === 37 ||
            (48 <= k && k <= 90) ||
            (96 <= k && k <= 111) ||
            (144 <= k && k <= 222)){
        this.removeSelected();
      }
    },
    'input.open keydown': function(el, ev){
      if(ev.keyCode===40){
        this.element.find('.dropdown-menu a')[0].focus()
      }
    },
    '.selected click': 'removeSelected',
    removeSelected() {
      this.show();
      this.viewModel.attr('selected', '');
    },
    '.search-clear click': function(el, ev){
      ev.stopPropagation();
      this.viewModel.attr('value', '');
      this.element.find('.autocomplete')[0].focus();
    },
  	show() {
  		this.viewModel.attr('showAutocomplete', true);
  	},
  	hide() {
  		this.viewModel.attr('showAutocomplete', false);
  	}
  }
});