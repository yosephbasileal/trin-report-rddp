'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var HeaderActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.HEADER_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  checkLogin: function() {
    $.ajax({
      type: "GET",
      url: '/check-loggedin',
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.HEADER_LOGIN_RESPONSE_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getUser: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.HEADER_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },

  signOut: function () {
    window.location.href = '/signout';
  }
};

module.exports = HeaderActions;
