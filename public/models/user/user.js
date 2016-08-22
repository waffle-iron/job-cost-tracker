import can from 'can';
import superMap from 'job-tracker/models/superMap';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';

class TokenStore {
  constructor({ key="id_token" } = {}) {
    this.key = key;
  }
  fetchToken() {
    return Promise.resolve(localStorage.getItem(this.key));
  }
  setToken(token) {
    return Promise.resolve(localStorage.setItem(this.key, token));
  }
  deleteToken() {
    return Promise.resolve(localStorage.removeItem(this.key));
  }
}

//TODO: is this the right place to do all this...?
function beforeSend(xhr) {
  let id_token = localStorage.getItem('id_token');
  if (id_token) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + id_token);
  }
}
$.ajaxSetup({ beforeSend });

export const User = can.Map.extend({
  tokenStore: new TokenStore(),
  authenticateUserWithtoken(id_token) {
    if (!id_token) {
      return Promise.reject(new Error('No token provided to authenticate user'));
    }
    return this.setIdToken(id_token)
      .then(_ => {
        return new Promise(( resolve, reject ) => {
            $.ajax({
              type: "GET",
              url: '/api/users/current-user'
            }).then(resolve, reject);
          });
      })
      .then(ajaxResult => new User(ajaxResult))
      .catch(err => { console.error(err); throw err; }); // eslint-disable-line no-console
  },
  getIdToken(token) {
    return this.tokenStore.fetchToken();
  },
  setIdToken(token) {
    return this.tokenStore.setToken(token);
  },
  deleteIdToken() {
    return this.tokenStore.deleteToken();
  },
  getCurrentUser() {
    return userConnection.getData({ user_id: 'current-user' })
  }
}, {
  define: {
    isAdmin: {
      get() {
        let roles = this.attr('roles');
        return roles && roles.filter(role => role.toLowerCase() === 'admin').length > 0;
      },
      set(newVal) {
        let roles = this.attr('roles');
        if (!roles) {
          roles = new can.List();
        }
        if (newVal) {
          if (roles.indexOf('admin') === -1) {
            roles.push('admin');
          }
        } else {
          if (roles.indexOf('admin') !== -1) {
            roles = roles.filter(role => role !== 'admin');
          }
        }
        this.attr('roles', roles);
        this.save();
      }
    },
    provider: {
      get() {
        let user_id = this.attr('user_id');
        let provider = user_id.substring(0, user_id.indexOf('|'));
        return provider;
      }
    }
  }
});

User.List = can.List.extend({
  Map: User
}, {});

export const userConnection = superMap({
  url: {
    getListData: "GET /api/users",
    getData: "GET /api/users/{user_id}",
    createData: "POST /api/users",
    updateData: function(user) {
      // only allow updating roles
      let { roles, user_id } = user;
      return can.ajax({
        processData: false,
        url: "/api/users/" + user_id,
        method: "PATCH",
        data: JSON.stringify({ roles }),
        contentType: 'application/json'
      });
    },
    destroyData: "DELETE /api/users/{user_id}"
  },
  idProp: 'user_id',
  Map: User,
  List: User.List,
  name: 'user'
});

tag('user-model', userConnection);

export default User;
