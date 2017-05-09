'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var get_default_state = function() {
  return Immutable.fromJS({
    'logged_in': false,
    'auto-refresh': true,
    'user': new Map()
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var HeaderStore = assign({}, EventEmitter.prototype, {
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

HeaderStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.HEADER_LOGIN_RESPONSE_LOADED:
      _state = _state.merge(Immutable.fromJS(payload));
      HeaderStore.emitChange();
      break;
    case ActionTypes.HEADER_FIELD_ITEM_UPDATED:
      _state = _state.merge(Immutable.fromJS(payload));
      HeaderStore.emitChange();
      break;
    case ActionTypes.HEADER_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    default:
      break;
  }

  return true;
});

module.exports = HeaderStore;
