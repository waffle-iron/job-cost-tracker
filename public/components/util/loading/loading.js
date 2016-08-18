import can from "can";
import $ from "jquery";
import './loading.less!';
import _ from 'lodash';

can.view.attr("loading", function( el, attrData ){
	var updateValue = _.debounce(function(ev, newVal, oldVal){
		if(can.isDeferred(newVal)){
			if(newVal.state()!=="resolved"){
				$(el).addClass('is-loading');
				newVal.then(function(){
					$(el).removeClass('is-loading');
				});
			}else{
				$(el).removeClass('is-loading');
			}

		} else {
			var isLoading;

			if(typeof newVal === 'boolean'){
				isLoading = newVal
			} else {
				isLoading = !!newVal
			}

			$(el)[isLoading ? 'addClass' : 'removeClass']('is-loading');
		}
	}, 250);

	var updateAttribute = function(){
		var attrValue = el.getAttribute("loading");

		if(attrValue === 'true' || attrValue === 'false'){
			$(el)[(!!attrValue) ? 'addClass' : 'removeClass']('is-loading');
		}else {
			attrData.scope.compute(attrValue).bind("change", updateValue);
			updateValue();
		}
	}
	
	$(el).bind("attributes", function(ev) {
		if(ev.attributeName === "loading") {
			updateAttribute();
		}
	});

	updateAttribute();
});