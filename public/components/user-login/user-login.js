import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './user-login.less!';
import template from './user-login.stache!';
// import Auth0Lock from 'auth0-lock';
import capitalize from 'lodash/string/capitalize';
import User from 'job-tracker/models/user/';
import assign from 'lodash/object/assign';

const loginModal = {
  show(options) {
    let opts = assign(this.defaults, options);
    return new Promise((resolve, reject) => {
      lock.show(opts, (err, profile, token) => {
        if (err) {
          reject(err);
        }
        resolve({ profile, token });
      });
    });
  },
  defaults: {
    icon: '/assets/user.svg',
    socialBigButtons: false,
    gravatar: true,
    sso: true,
    authParams: {
      scope: 'openid user_id name email nickname picture'
    }
  }
};

export const ViewModel = Map.extend({
  define: {
    currentUser: {
      value: null
    },
    // used to ensure a currentUser before determining if we should show login
    fetchCurrentUserPromise: {
      type(data) {
        return Promise.resolve(data);
      },
      value: null
    },
    loginModal: {
      type: '*',
      value: loginModal
    }
  },
  openLogin(options) {
    // this.attr('loginModal')
    //   .show(options)
    //   .then((authValues) => {
    //     return this.getCurrentUserFromToken(authValues.token);
    //   })
    //   .catch(err => {
    //     //TODO: show error to user?
    //     console.error(err); // eslint-disable-line no-console
    //     throw err;
    //   });
  },
  logout() {
    return User.deleteIdToken()
      .then(_ => {
        this.attr('currentUser', null);
        this.dispatch('logout');
        this.openLogin({ closable: false });
      })
      .catch(err => console.error(err)); // eslint-disable-line no-console
  },
  getCurrentUserFromToken(token) {
    var fetchCurrentUserPromise = User.getCurrentUser(token)
      .then(user => {
        this.attr('currentUser', user);
        return user;
      });
    this.attr('fetchCurrentUserPromise', fetchCurrentUserPromise);
    return fetchCurrentUserPromise;
  },
  capitalize: capitalize
});

export default Component.extend({
  tag: 'user-login',
  viewModel: ViewModel,
  template,
  events: {
    init(elem, options) {
      let viewModel = this.viewModel;
      User.getIdToken()
        .then(id_token => {
          if (id_token) {
            return viewModel.getCurrentUserFromToken(id_token);
          }
        })
        .catch(err => console.error(err)); // eslint-disable-line no-console
    },
    inserted(elem, ev) {
      this.viewModel.attr('fetchCurrentUserPromise').then(_ => {
        if ( !this.viewModel.attr('currentUser') ) {
          this.viewModel.openLogin({
            closable: false
          });
        }
      });
    }
  }
});
