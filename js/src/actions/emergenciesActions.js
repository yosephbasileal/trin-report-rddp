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
    console.log('getting emergency recods');
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
  },

  getReports: function() {
    console.log('getting incident reports');
    $.ajax({
      type: "GET",
      url: '/api/rddp/report-records',
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.REPORTS_DATA_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getReports: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORTS_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },

  updateEmergencies: function(current_list_ids) {
    var data = {'current_list_ids': current_list_ids};
    $.ajax({
      type: "POST",
      url: '/api/rddp/emergency-records-update',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.EMERGENCIES_DATA_UPDATED,
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
