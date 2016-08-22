[![Stories in Ready](https://badge.waffle.io/donejs/job-cost-tracker.png?label=ready&title=Ready)](https://waffle.io/donejs/job-cost-tracker)
# job-cost-tracker

[![Join the chat at https://gitter.im/donejs/job-cost-tracker](https://badges.gitter.im/donejs/job-cost-tracker.svg)](https://gitter.im/donejs/job-cost-tracker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.com/bitovi/jobcosttracker.svg?token=dyyk9qzTjNBWR2Yq1HxW&branch=master)](https://travis-ci.com/bitovi/jobcosttracker)

Prototype: http://share.bitovi.com/6RHKOA/#p=new_custom_work_order

## Setup
This setup expects node version `4.2.*` and npm `2.14.*` to be installed.

1. Install MongoDB (https://docs.mongodb.org/master/tutorial/install-mongodb-on-os-x/)
  * `brew update`
  * `brew install mongodb`
  * Create the data directory with `mkdir -p /data/db` (might need sudo)
  * Run `mongod`
  * If you get an "Unable to create/open lock file" error, try `sudo chown -R ``id -u`` /data/db`
1. Install MongoDB manager
  * https://github.com/jeromelebel/MongoHub-Mac
1. `git clone https://github.com/bitovi/jobcosttracker.git`
1. `cd jobcosttracker`
1. `npm install`
1. `donejs develop`

## Run
Run the app with `donejs develop`

## Development (Server)

### api/config.js
#### connections
Handles the connection strings for MongoDB and other services

#### clientRoutes
A list of all client routes (mainly used for direct linking to non-root 'pages' in the app)

### api/index.js
Sets up the server.  Front-end assets are hosted, and the `api/app.js` file is set up to be used as the `/api` root.

### api/app.js
This file is the entry-point for the server-side application code.

### api/hooks
Generic service hooks.

### api/middleware
#### error.js
Global error handler

#### index-routes.js
Serves the index file for all of the client routes (`config.clientRoutes`)

#### index.js
Middleware entry point – sets up error handling (`error.js`)

### api/models
Houses all the models.  Models are configured in `feathers-mongoose` style.  For more information, see: https://github.com/feathersjs/feathers-mongoose

The base configuration for a model looks like this:
```javascript
import _ from 'lodash';
import BaseSchema from './BaseSchema';

export default _.merge({}, BaseSchema, {
    schema: {
      title: { type: String }
    },
    methods: { //optional
    },
    statics: { //optional
    },
    virtuals: { //optional
    },
    indexes: [ //optional
    ],
    //hooks
    before: { //optional
    },
    after: { //optional
    }
});
```
..where BaseSchema holds things like `createdAt`, `updatedAt`, etc as well as the necessary hooks for all models.

For more information about adding hooks to a service via the model, see: https://github.com/feathersjs/feathers-mongoose#using-with-feathers-hooks

For more information about the hooks themselves, see: https://github.com/feathersjs/feathers-hooks

> Note: Hooks have the `app` property available via `hook.params.app` as follows:
```javascript
function(hook, next) {
    var app = hook.params.app;
    //do something with the app ( such as app.service('todos').find(opts,() => next()) )
}
```
For an example on how to add hooks to a model, see `/api/models/todo.js`

### api/services
Each service uses `feathers-mongoose` style.  For more information, see: For more information, see: https://github.com/feathersjs/feathers-mongoose

The base configuration for a service is as follows:
`api/services/example.js`

```javascript
import mongooseService from 'feathers-mongoose';
import config from '../../config';
import ModelSchema from '../../models/example.js';

export default function() {
  const app = this;

    app.use('/examples', mongooseService('example', ModelSchema, config.connections.mongodb));

}
```

#### api/services/index.js
Sets up all services



## Development (Client)
