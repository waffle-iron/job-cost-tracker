import jwt from 'express-jwt';
import config from '../config';

export var jwtCheck = jwt({
  secret: new Buffer(config.auth0.clientSecret, 'base64'),
  audience: config.auth0.clientID
});

export function noUserErrorHandler(err, req, res, next) {
  if (!req.user) {
    return res.sendStatus(403);
  }
  next(err);
}

export function userAuthorizedCheck(req, res, next) {
  let decodedUserInfo = req.user;
  if (!decodedUserInfo || !decodedUserInfo.app_metadata || !decodedUserInfo.app_metadata.authorized) {
    return res.sendStatus(403);
  }
  next();
}

export default function() {
  const app = this;
  return app
    .use(jwtCheck)
    .use(noUserErrorHandler);
}
