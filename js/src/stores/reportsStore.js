'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var RSA = require('../actions/rsa');

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var get_default_state = function() {
  return Immutable.fromJS({
    'reports': [],
    'reports_loaded': false
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var ReportsStore = assign({}, EventEmitter.prototype, {
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

ReportsStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.REPORTS_DATA_LOADED:
      var data = Immutable.fromJS(payload).get('reports');
      for (var i = 0; i < data.size; i++) {
        var e = data.get(i);
        e = e.set('reporer_name', decrypt(e.get('reporer_name')));
        e = e.set('reporter_dorm', decrypt(e.get('reporter_dorm')));
        e = e.set('reporter_email', decrypt(e.get('reporter_email')));
        e = e.set('reporter_phone', decrypt(e.get('reporter_phone')));
        e = e.set('reporter_id_num', decrypt(e.get('reporter_id_num')));

        e = e.set('urgency', decrypt(e.get('urgency')));
        e = e.set('type', decrypt(e.get('type')));
        e = e.set('location', decrypt(e.get('location')));
        e = e.set('description', decrypt(e.get('description')));
        data = data.set(i, e);
      }
      _state = _state.set('reports', data);
      _state = _state.set('reports_loaded', true);
      ReportsStore.emitChange();
      break;
    case ActionTypes.REPORTS_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    case ActionTypes.REPORTS_UNITENTIFIED_ERROR:
      _state = _state.merge(Immutable.fromJS(payload));
      ReportsStore.emitChange();
      break;
    default:
      break;
  }

  return true;
});

module.exports = ReportsStore;
