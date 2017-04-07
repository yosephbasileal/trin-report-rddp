'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var RSA = require('../actions/rsa');

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
    'report_loaded': false,
    'images': []
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

var admin_key_pem = localStorage.getItem("admin_private_key");
var decrypt = function(cipher) {
  return RSA.decrypt(cipher , admin_key_pem);
}

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
    case ActionTypes.REPORT_FOLLOWUP_INITIATED:
      var e = Immutable.fromJS(payload).get('report');
      e = e.set('reporer_name', decrypt(e.get('reporer_name')));
      e = e.set('reporter_dorm', decrypt(e.get('reporter_dorm')));
      e = e.set('reporter_email', decrypt(e.get('reporter_email')));
      e = e.set('reporter_phone', decrypt(e.get('reporter_phone')));
      e = e.set('reporter_id_num', decrypt(e.get('reporter_id_num')));

      e = e.set('urgency', decrypt(e.get('urgency')));
      e = e.set('type', decrypt(e.get('type')));
      e = e.set('location', decrypt(e.get('location')));
      e = e.set('description', decrypt(e.get('description')));
      _state = _state.set('report', e);
      ReportDialogStore.emitChange();
      break;
    case ActionTypes.REPORTS_MESSAGES_DATA_LOADED:
    case ActionTypes.REPORT_SEND_MESSAGE_SUCCESS:
      var data = Immutable.fromJS(payload).get('messages');
      for (var i = 0; i < data.size; i++) {
        var e = data.get(i);
        e = e.set('content', decrypt(e.get('content')));
        data = data.set(i, e);
      }
      _state = _state.set('messages', data);
      _state = _state.set('message', '');
      ReportDialogStore.emitChange();
      break;
    case ActionTypes.REPORT_IMAGES_LOADED:
      console.log('images loaded in store');
      console.log(payload);
      console.log(Immutable.fromJS(payload));

      _state = _state.merge(Immutable.fromJS(payload));
      ReportDialogStore.emitChange();
      break;
    case ActionTypes.REPORT_DIALOG_CLOSE:
    case ActionTypes.REPORT_DIALOG_UNITENTIFIED_ERROR:
    case ActionTypes.REPORT_UPDATE_MESSAGE:
    case ActionTypes.REPORT_SEND_MESSAGE_FAILED:
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
