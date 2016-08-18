import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './app-nav.less!';
import template from './app-nav.stache!';

export const ViewModel = Map.extend({
  define: {
    links: {
      value: [{
        "label": "Tasks",
        "icon": "ok", //TODO
        "href": "/tasks"
      },{
        "label": "Task Day",
        "icon": "calendar", //TODO
        "href": "/task-day"
      },{
        "label": "Reports",
        "icon": "signal", //TODO
        "href": "/reports"
      }]
    },
    createLinks: {
      value: [{
        "label": "New Lot",
        "href": "/new-lot"
      },{
        "label": "New Task Day",
        "href": "/new-task-day"
      },{
        "label": "Custom Work Order",
        "href": "/custom-work-order"
      }]
    },
    adminLinks: {
      value: [{
        "label": "Manage Users",
        "href": "/manage-users"
      },{
        "label": "Data Cleanup",
        "href": "/data-cleanup"
      }]
    },
    popoverActive:{
        value: ''
    }
  },
  activeLink: function(href){
    var route = can.route.attr(),
        currentPage = route.page,
        currentLinkHref = href.replace("/","");

    if(currentPage === currentLinkHref){
        return true;
    }else if(currentLinkHref === "create"){
        var isCreateLink = false,
            createLinks = this.attr("createLinks");
        for(var i = 0; i < createLinks.length; i++){
            if(createLinks[i].href.replace("/", "") === currentPage){
                isCreateLink = true;
                break;
            }
        }
        if(isCreateLink){
            return true;
        }
    }else if(currentLinkHref === "admin"){
      var isAdminLink = false,
          adminLinks = this.attr("adminLinks");

        for(var i = 0; i < adminLinks.length; i++){
          if(adminLinks[i].href.replace("/", "") === currentPage){
            isAdminLink = true;
            break;
          }
        }
        if(isAdminLink){
          return true;
        }
    }


    return false;
  },
  togglePopover: function(name){
    if(this.attr('popoverActive')===name){
      this.attr('popoverActive', '');
    }else{
      this.attr("popoverActive", name);
    }
  }
});

export default Component.extend({
  tag: 'app-nav',
  viewModel: ViewModel,
  template,
  events: {
    "{window} click": function(el,ev){
        var $target = $(ev.target);
        if(!$target.closest(".popover-wrap").length){
            this.viewModel.attr("popoverActive", '');
        }
    }
  }
});
