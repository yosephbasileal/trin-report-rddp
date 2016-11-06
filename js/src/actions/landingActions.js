'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var LandingActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.LANDING_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  getRecords: function() {
    $.ajax({
      type: "GET",
      url: '/emergency-records',
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_RECORDS_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getRecords: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }
};

module.exports = LandingActions;
