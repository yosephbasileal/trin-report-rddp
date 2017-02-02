'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var EmergencyDialogActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.EMERGENCY_DIALOG_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  handleClose: function(change) {
  	AppDispatcher.dispatch({
      type: ActionTypes.EMERGENCY_DIALOG_CLOSE_DATA_LOADED,
      payload: change
    });
  },

   getEmergencyData: function(emergency_id) {
    $.ajax({
      type: "GET",
      url: '/get-emergency-record/' + emergency_id,
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.EMERGENCY_DIALOG_DATA_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getEmergencyData: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },

  markAsRecieved: function(data) {
    $.ajax({
      type: "POST",
      url: '/mark-emergency-as-recieved',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.EMERGENCY_MARK_AS_RECEIEVED,
          payload: res
        });
      },
      error: function(res) {
        console.log('markAsRecieved: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.LANDING_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },
};

module.exports = EmergencyDialogActions;