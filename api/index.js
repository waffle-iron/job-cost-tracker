// This file sets up the full stack (ties front-end to back-end)
require('babel-core/register');

var mustacheExpress = require('mustache-express');
var path = require('path');
var feathers = require('feathers');
var api = require('./app');
var dir = path.join(__dirname, '..', 'public');
var app = feathers();
var indexRoutes = require('./middleware/index-routes');
app.configure(function(){
    // Register '.mustache' extension with The Mustache Express
    app.engine('mustache', mustacheExpress());

    app.set('view engine', 'mustache');
    app.set('views', __dirname + '/views');

    app.configure(indexRoutes);
    app.use(feathers.static(dir));
    app.use('/api', api);
    app.api = api;
    var oldListen = app.listen;
    app.listen = function() {
      var server = oldListen.apply(this, arguments);
      api.setup(server);
      return server;
    };
});


app.listen(process.env.PORT || 3030);
