import authentication, { hooks as authHooks } from 'feathers-authentication';
import errors from 'feathers-errors';
import intersection from 'lodash/array/intersection';
import config from '../../config';
import User from '../users/model';

export let NotAuthenticated = errors.NotAuthenticated;

let tokenToPayload = authHooks.verifyToken({
  secret: new Buffer(config.auth0.clientSecret, 'base64'),
  audience: config.auth0.clientID
});

function userObjectFromPayload(payload) {
  let { user_id, email, nickname, name, picture } = payload;
  return {
    _id: user_id,
    email,
    nickname,
    name,
    picture,
    roles: []
  };
}

function userFromPayload(hook) {
  let payload = hook.params.payload;
  if (payload) {
    return User.findById(payload.user_id).exec()
      .then(user => {
        if (!user) {
          throw Error('No user found');
        }
        if (hook.params.updateUser) {
          let user = userObjectFromPayload(payload);
          delete user.roles;
          return User.findByIdAndUpdate(payload.user_id, user).exec()
            .then(result => {
              hook.params.user = result.toObject();
              return hook;
            });
        }
        hook.params.user = user.toObject();
        return hook;
      })
      .catch(err => {
        let user = userObjectFromPayload(payload);
        return new User(user).save()
          .then(user => {
            hook.params.user = user.toObject();
            return hook;
          })
          .catch(err => {
            throw new NotAuthenticated('Not authorized');
          });
      });
  }
  throw new NotAuthenticated('Not authorized');
}

export function userHasRole(user, roles) {
  let val = intersection(user.roles, [].concat(roles)).length > 0;
  return val;
}

export function authenticate(updateUser) {
  return function authenticateHook(hook) {
    if (updateUser) {
      hook.params.updateUser = true;
    }
    return Promise.resolve(hook)
      .then(tokenToPayload)
      .then(userFromPayload);
  };
}

export function authorize(role) {
  return function authorizationHook(hook) {
    if (role && !userHasRole(hook.params.user, role)) {
      throw new NotAuthenticated('Not authorized');
    }
    return hook;
  };
}

export function auth({ role, updateUser } = {}) {
  let authorizationHook = authorize(role);
  let authenticateHook = authenticate(updateUser);

  return function authHook(hook) {
    let getHook = Promise.resolve( hook );
    // if user already exists just jump to Authorization
    if ( !hook.params.user ) {
      getHook = getHook.then( authenticateHook );
    }
    return getHook.then( authorizationHook );
  };
}

export {
  NotAuthenticated as NotAuthenticatedError,
  userHasRole
};
export default auth;
