'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var RSA = require('../actions/rsa');

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var get_default_state = function() {
  return Immutable.fromJS({
    'emergencies': [],
    'reports': [],
    'emergencies_loaded': false,
    'map_ready': false,
    'map': null,
    'markers': []
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var LandingStore = assign({}, EventEmitter.prototype, {
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

LandingStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.LANDING_REPORTS_LOADED:
    case ActionTypes.LANDING_MAP_LOADED:
    case ActionTypes.LANDING_MAP_CLEAR_MARKERS:
      _state = _state.merge(Immutable.fromJS(payload));
      LandingStore.emitChange();
      break;

    case ActionTypes.LANDING_EMERGENCIES_LOADED:
      var data = Immutable.fromJS(payload).get('emergencies');
      for (var i = 0; i < data.size; i++) {
        var e = data.get(i);
        e = e.set('name', decrypt(e.get('name')));
        e = e.set('id_num', decrypt(e.get('id_num')));
        e = e.set('phone', decrypt(e.get('phone')));
        e = e.set('explanation', decrypt(e.get('explanation')));
        data = data.set(i, e);
      }
      _state = _state.set('emergencies', data);
      _state = _state.set('emergencies_loaded', true);
      LandingStore.emitChange();
      break;

    case ActionTypes.LANDING_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    case ActionTypes.LANDING_UNITENTIFIED_ERROR:
      _state = _state.merge(Immutable.fromJS(payload));
      LandingStore.emitChange();
      break;
    default:
      break;
  }

  return true;
});

module.exports = LandingStore;
