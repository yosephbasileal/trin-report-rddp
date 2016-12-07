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

  getEmergencies: function() {
    $.ajax({
      type: "GET",
      url: '/emergency-records',
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_EMERGENCIES_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getEmergencies: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },

  getReports: function() {
    $.ajax({
      type: "GET",
      url: '/report-records',
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_REPORTS_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getReports: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }
};

module.exports = LandingActions;
