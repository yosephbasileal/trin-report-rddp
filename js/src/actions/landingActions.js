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

  mapLoaded: function(loaded) {
    AppDispatcher.dispatch({
      type: ActionTypes.LANDING_MAP_LOADED,
      payload: loaded
    });
  },

  getEmergencies: function() {
    $.ajax({
      type: "GET",
      url: '/api/rddp/emergency-records',
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
      url: '/api/rddp/report-records',
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
