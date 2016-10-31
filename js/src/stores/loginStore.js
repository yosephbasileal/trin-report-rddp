'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var get_default_state = function() {
  return Immutable.fromJS({
    'email': '',
    'email_error': '',
    'password': '',
    'password_error': '',
    'unidentified_error': false
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var LoginStore = assign({}, EventEmitter.prototype, {
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

LoginStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.LOGIN_FAILED:
      _state = Immutable.fromJS(payload);
      LoginStore.emitChange();
      break;
    case ActionTypes.LOGIN_FIELD_ITEM_UPDATED:
      _state = _state.merge(Immutable.fromJS(payload));
      LoginStore.emitChange();
      break;
    case ActionTypes.LOGIN_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    case ActionTypes.LOGIN_UNITENTIFIED_ERROR:
      _state = _state.merge(Immutable.fromJS(payload));
      LoginStore.emitChange();
      break;
    case ActionTypes.LOGIN_CLEAR_UNIDENTIFIED_ERROR:
      _state = _state.merge(Immutable.fromJS(payload));
      LoginStore.emitChange();
      break;
    default:
      break;
  }

  return true;
});

module.exports = LoginStore;
