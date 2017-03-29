'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var ReportsActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.REPORTS_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },


  getReports: function() {
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
  }
};

module.exports = ReportsActions;
