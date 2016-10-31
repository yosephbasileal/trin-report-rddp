'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var get_default_state = function() {
  return Immutable.fromJS({
    'records': []
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

LandingStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.LANDING_RECORDS_LOADED:
      _state = Immutable.fromJS(payload);
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
