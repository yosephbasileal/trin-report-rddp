'use strict';

var Immutable = require('immutable');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var get_default_state = function() {
  return Immutable.fromJS({
    'image': '',
    'image_loaded': false,
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var ReportImageStore = assign({}, EventEmitter.prototype, {
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

ReportImageStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.REPORT_IMAGE_DATA_LOADED:
      _state = _state.merge(Immutable.fromJS(payload));
      ReportImageStore.emitChange();
      break;
    case ActionTypes.REPORT_IMAGES_UNITENTIFIED_ERROR:
      _state = _state.merge(Immutable.fromJS(payload));
      ReportImageStore.emitChange();
      break;
    case ActionTypes.REPORT_IMAGE_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    default:
      break;
  }

  return true;
});

module.exports = ReportImageStore;
