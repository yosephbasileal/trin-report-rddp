'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var $ = require('jquery');

var get_default_state = function() {
  var m = new Map();
  m.set('unidentified_error', false);
  m.set('form', Immutable.fromJS({
    'email': '',
    'pass': '',
    'email_error': '',
    'pass_error': '',
    'public_key': null
  }));
  
  return m;
};

var _state = get_default_state()

var _changes = Immutable.Map();

var CHANGE_EVENT = 'change';

var SignupStore = assign({}, EventEmitter.prototype, {
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

SignupStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.SIGNUP_FAILED:
      _state.set('form', _state.get('form').merge(Immutable.fromJS(payload)));
      _state.set('unidentified_error', false);
      SignupStore.emitChange();
      break;
    case ActionTypes.SIGNUP_KEY_CREATED:
    case ActionTypes.SIGNUP_FIELD_ITEM_UPDATED:
      _state.set('form', _state.get('form').merge(Immutable.fromJS(payload)));
      SignupStore.emitChange();
      break;
    case ActionTypes.SIGNUP_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    case ActionTypes.SIGNUP_UNITENTIFIED_ERROR:
    case ActionTypes.SIGNUP_CLEAR_UNIDENTIFIED_ERROR:
      _state.set('unidentified_error', Immutable.fromJS(payload).get('unidentified_error'));
      SignupStore.emitChange();
      break;
    default:
      break;
  }

  return true;
});

module.exports = SignupStore;
