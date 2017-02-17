'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var get_default_state = function() {
  return Immutable.fromJS({
    'open': true,
    'receieved': false,
    'emergency': new Map(),
    'data_loaded': false,
    'map': null,
    'marker': null,
    'timer': null,
    'map_ready': false
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var EmergencyDialogStore = assign({}, EventEmitter.prototype, {
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

 EmergencyDialogStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.EMERGENCY_DIALOG_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    case ActionTypes.EMERGENCY_DIALOG_DATA_LOADED:
    case ActionTypes.EMERGENCY_DIALOG_CLOSE:
    case ActionTypes.EMERGENCY_MARK_AS_RECEIEVED:
    case ActionTypes.EMERGENCY_MAP_LOADED:
      _state = _state.merge(Immutable.fromJS(payload));
      EmergencyDialogStore.emitChange();
      break;
    case ActionTypes.EMERGENCY_DIALOG_DATA_RECEIVED:
      console.log('received');
      _state = _state.merge(Immutable.fromJS(payload));
      EmergencyDialogStore.emitChange();
      break;
    default:
      break;
  }

  return true;
});

module.exports = EmergencyDialogStore;
