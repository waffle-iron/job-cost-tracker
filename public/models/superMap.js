var connect = require("can-connect");

require("can-connect/constructor/");
require("can-connect/can/map/");
require("can-connect/can/");
require("can-connect/constructor/store/");
require("can-connect/constructor/callbacks-once/");
require("can-connect/data/callbacks/");
require("can-connect/data/combine-requests/");
require("can-connect/data/parse/");
require("can-connect/data/url/");
require("can-connect/real-time/");

var Map = require("can/map/map");
var List = require("can/list/list");

connect.superMap = function(options){

	var behaviors = [
		"constructor",
		"can-map",
		"constructor-store",
		"data-callbacks",
		"data-combine-requests",
		"data-parse",
		"data-url",
		"real-time",
		"constructor-callbacks-once"];

	options.ajax = $.ajax;

	return connect(behaviors,options);
};

module.exports = connect.superMap;