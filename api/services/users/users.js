import mongooseService from 'feathers-mongoose';
import User from './model';
import auth, { userHasRole, NotAuthenticatedError } from '../hooks/auth';

export default function() {
  const app = this;

  let services = mongooseService({
    Model: User
  });

  let featherMongooseGet = services.get.bind(services);

  services.get = function(id, params, callback) {
    if (id === 'current-user') {
      id = params.user.user_id;
    }
    if (id === params.user.user_id || userHasRole(params.user, 'admin')) {
      return featherMongooseGet(id, params, callback);
    }
    callback(new NotAuthenticatedError('Not authorized'));
  };

  app.use('/users', services);

  const service = app.service('/users');

    service.before({
      get: [
        auth({ updateUser: true })
      ],
      find: [
        auth({ role: "admin" })
      ],
      patch: [
        auth({ role: "admin" })
      ],
      remove: [
        auth({ role: "admin" })
      ]
    });

}
