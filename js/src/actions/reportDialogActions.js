'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');


var ReportDialogActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.REPORT_DIALOG_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  saveData: function(change) {
    setTimeout(function()
    {
      AppDispatcher.dispatch({
        type: ActionTypes.REPORT_DIALOG_INIT_DATA,
        payload: change
      });
    },
      1
    );
  },

  handleClose: function(change) {
  	AppDispatcher.dispatch({
      type: ActionTypes.REPORT_DIALOG_CLOSE,
      payload: change
    });
  },

  updateMessage: function(change) {
    AppDispatcher.dispatch({
      type: ActionTypes.REPORT_UPDATE_MESSAGE,
      payload: change
    });
  },

  sendMessage: function(data) {
    $.ajax({
      type: "POST",
      url: '/api/rddp/add-new-message',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_SEND_MESSAGE_SUCCESS,
          payload: res
        });
      },
      error: function(res) {
        if (res.status === 400) {
          AppDispatcher.dispatch({
            type: ActionTypes.REPORT_SEND_MESSAGE_FAILED,
            payload: res.responseJSON
          });
        } else {
          console.log('sendMessage: some unidentified error');
          AppDispatcher.dispatch({
            type: ActionTypes.REPORT_SEND_UNITENTIFIED_ERROR,
            payload: {}
          });
        }
      }
    });
  },

  onMarkAsArchived: function(data) {
    $.ajax({
      type: "POST",
      url: '/api/rddp/mark-report-as-archived',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        window.location.href = res.redirect;
      },
      error: function(res) {
        console.log('onMarkAsArchived: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_DIALOG_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },

  initiateFollowup: function(data) {
    $.ajax({
      type: "POST",
      url: '/api/rddp/initiate-report-followup',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        console.log(res);
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_FOLLOWUP_INITIATED,
          payload: res
        });
      },
      error: function(res) {
        console.log('initiateFollowup: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_DIALOG_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }, 

  getMessages: function(report_id) {
    $.ajax({
      type: "GET",
      url: '/api/rddp/report-followup-messages/' + report_id,
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.REPORTS_MESSAGES_DATA_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getMessages: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORTS_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }
};

module.exports = ReportDialogActions;
