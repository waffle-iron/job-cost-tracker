import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './user-manager.less!';
import template from './user-manager.stache!';
import User from "job-tracker/models/user/";

export const ViewModel = Map.extend({
  define: {

  },
  removeUser(user) {
    let nameEmail = user.attr("email") || user.attr("nickname");
    if (confirm("Are you sure you want to destroy user:" + nameEmail) ) { // eslint-disable-line no-alert
      user.destroy();
    }
  },
  social(user) {
    let social;
    switch (user.attr('provider')) {
      case 'auth0': social = '-'; break;
      case 'google-oauth2': social = 'google'; break;
      case 'facebook': social = 'facebook'; break;
      default: social = '';
    }
    return social;
  }
});

export default Component.extend({
  tag: 'user-manager',
  viewModel: ViewModel,
  template
});
