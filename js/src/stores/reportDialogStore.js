'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var ReportsStore = require('./reportsStore');

var get_default_state = function() {
  return Immutable.fromJS({
    'open': true,
    'data_loaded': false,
    'messages': [],
    'message': '',
    'message_error': '',
    'report': new Map(),
    'report_loaded': false
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var ReportDialogStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  listen: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  unlisten: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  getState: function() {
    return _state;
  }
});

 ReportDialogStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;
  console.log(type);
  switch (type) {

    case ActionTypes.REPORT_DIALOG_INIT_DATA:
      AppDispatcher.waitFor([ReportsStore.dispatchToken]);
      _state = _state.merge(Immutable.fromJS(payload));
      ReportDialogStore.emitChange();
      break;


    case ActionTypes.REPORT_DIALOG_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    case ActionTypes.REPORT_DIALOG_CLOSE:
    case ActionTypes.REPORT_DIALOG_UNITENTIFIED_ERROR:
    case ActionTypes.REPORTS_MESSAGES_DATA_LOADED:
    case ActionTypes.REPORT_UPDATE_MESSAGE:
    case ActionTypes.REPORT_SEND_MESSAGE_SUCCESS:
    case ActionTypes.REPORT_SEND_MESSAGE_FAILED:
    case ActionTypes.REPORT_FOLLOWUP_INITIATED:
    case ActionTypes.REPORT_DIALOG_INIT_DATA:
      _state = _state.merge(Immutable.fromJS(payload));
      ReportDialogStore.emitChange();
      break;
    default:
      break;
  }
  console.log('Done');
  return true;
});

module.exports = ReportDialogStore;
