'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var SignupActions = {
  updateFieldInfo: function(change) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGNUP_FIELD_ITEM_UPDATED,
      payload: change
    });
  },

  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGNUP_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  saveKey: function(change) {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGNUP_KEY_CREATED,
      payload: key
    });
  },

  submitSignupInfo: function(data) {
    $.ajax({
      type: "POST",
      url: '/api/rddp/signup-admin',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        //window.location.href = res.redirect;
      },
      error: function(res) {
        if (res.status === 400) {
          AppDispatcher.dispatch({
            type: ActionTypes.SIGNUP_FAILED,
            payload: res.responseJSON
          });
        } else {
          console.log('submitSignupInfo: some unidentified error');
          // TODO handle this properly
          AppDispatcher.dispatch({
            type: ActionTypes.SIGNUP_UNITENTIFIED_ERROR,
            payload: {'unidentified_error': true}
          });
        }
      }
    });
  },

  clearError: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.SIGNUP_CLEAR_UNIDENTIFIED_ERROR,
      payload: {'unidentified_error': false}
    });
  },
};

module.exports = SignupActions;
