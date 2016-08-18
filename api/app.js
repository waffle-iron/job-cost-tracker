import feathers from 'feathers';
import rest from 'feathers-rest';
// import socket from 'feathers-socketio';
import hooks from 'feathers-hooks';
import bodyParser from 'body-parser';
import services from './services';
import { errorHandler, _idToId } from './middleware';

var app = feathers();

//TODO (BigAB): This is a ridiculous hack, please learn how to handle the _id problem and fix
function recurseIdTo_Id(req){
    for (let key in req) {
        if (typeof req[key] === 'object'){
            recurseIdTo_Id(req[key]);
        }
        else {
            if (key === 'id') {  // process leaf node
                req['_id'] = req['id'];
                delete req.id;
            }
        }
    }
    return req;
}


// Add REST API support
app
  .use(_idToId)
  .configure(rest())
  // TODO try feathers.socketio
  // .configure(socket())
  .configure(hooks())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(function(req, res, next){
    req.body = recurseIdTo_Id(req.body);
    next();
  })
  //add app to feathers requests (so that it is available in service hooks via hooks.params.app)
  .use(function(req, res, next) {
    req.feathers.app = app;
    next();
  })
  // take Authorization header and pass it to feathers as "token", no bearer
  .use(function(req, res, next) {
    let AUTHORIZATION_HEADER = req.headers['authorization'];
    if (AUTHORIZATION_HEADER) {
      let id_token = AUTHORIZATION_HEADER.replace('Bearer ', '');
      if (id_token) {
        req.feathers.token = id_token;
      }
    }
    next();
  })
  .configure(services)
  .use(errorHandler);

export default app;
