'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var LoginActions = {
  updateFieldInfo: function(change) {
    AppDispatcher.dispatch({
      type: ActionTypes.LOGIN_FIELD_ITEM_UPDATED,
      payload: change
    });
  },

  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.LOGIN_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  submitLoginInfo: function(data) {
    $.ajax({
      type: "POST",
      url: '/signin',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.LOGIN_SUCESS_BROADCAST,
          payload: res
        });
        // data.redirect contains the string URL to redirect to
        window.location.href = res.redirect;
      },
      error: function(res) {
        if (res.status === 400) {
          AppDispatcher.dispatch({
            type: ActionTypes.LOGIN_FAILED,
            payload: res.responseJSON
          });
        } else {
          console.log('some unidentified error');
          // TODO handle this properly
          AppDispatcher.dispatch({
            type: ActionTypes.LOGIN_UNITENTIFIED_ERROR,
            payload: {'unidentified_error': true}
          });
        }
      }
    });
  },

  clearError: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.LOGIN_CLEAR_UNIDENTIFIED_ERROR,
      payload: {'unidentified_error': false}
    });
  },
};

module.exports = LoginActions;
