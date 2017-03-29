'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var EmergenciesActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.EMERGENCIES_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  mapUpdated: function(loaded) {
    AppDispatcher.dispatch({
      type: ActionTypes.EMERGENCIES_MAP_LOADED,
      payload: loaded
    });
  },

  getEmergencies: function() {
    $.ajax({
      type: "GET",
      url: '/api/rddp/emergency-records',
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.EMERGENCIES_DATA_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getEmergencies: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.EMERGENCIES_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }
};

module.exports = EmergenciesActions;
