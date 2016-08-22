import AppMap from "can-ssr/app-map";
import route from "can/route/";
import 'can/map/define/';
import 'can/route/pushstate/';
import 'es6-math';

const AppViewModel = AppMap.extend({
  define: {
    title: {
      value: 'job-tracker',
      serialize: false
    },
    loadedComponents: {
      value: {},
      serialize: false
    },
    currentUser: {
      value: null,
      serialize: false
    }
  },
  userLogout() {
    localStorage.clear();
    route.attr({ page: 'home' });
  }
});

route(':page',{page: 'home'});


export default AppViewModel;
