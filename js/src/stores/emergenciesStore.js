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
    'emergencies_loaded': false,
    'map_ready': false,
    'map': null,
    'markers': []
  })
};

var _state = get_default_state();

var _changes = Immutable.Map();


var CHANGE_EVENT = 'change';

var EmergenciesStore = assign({}, EventEmitter.prototype, {
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

EmergenciesStore.dispatchToken = AppDispatcher.register(function(action) {
  var type = action.type;
  var payload = action.payload;

  switch (type) {
    case ActionTypes.EMERGENCIES_MAP_LOADED:
      _state = _state.merge(Immutable.fromJS(payload));
      EmergenciesStore.emitChange();
      break;

    case ActionTypes.EMERGENCIES_DATA_LOADED:
      var data = Immutable.fromJS(payload).get('emergencies');
      for (var i = 0; i < data.size; i++) {
        var e = data.get(i);
        e = e.set('name', decrypt(e.get('name')));
        e = e.set('id_num', decrypt(e.get('id_num')));
        e = e.set('phone', decrypt(e.get('phone')));
        e = e.set('email', decrypt(e.get('email')));
        e = e.set('dorm', decrypt(e.get('dorm')));
        e = e.set('longitude', parseFloat(decrypt(e.get('longitude'))));
        e = e.set('latitude', parseFloat(decrypt(e.get('latitude'))));
        e = e.set('explanation', decrypt(e.get('explanation')));
        data = data.set(i, e);
      }
      _state = _state.set('emergencies', data);
      _state = _state.set('emergencies_loaded', true);
      EmergenciesStore.emitChange();
      break;


    case ActionTypes.EMERGENCIES_DATA_UPDATED:
      // list of currently displayed emergencies
      var current_list = _state.get('emergencies');

      // list of new emergencies that just came in and are not diplayed yet
      var new_data = Immutable.fromJS(payload).get('new_emergencies');
      for (var i = 0; i < new_data.size; i++) {
        var e = new_data.get(i);
        e = e.set('name', decrypt(e.get('name')));
        e = e.set('id_num', decrypt(e.get('id_num')));
        e = e.set('phone', decrypt(e.get('phone')));
        e = e.set('email', decrypt(e.get('email')));
        e = e.set('dorm', decrypt(e.get('dorm')));
        e = e.set('longitude', parseFloat(decrypt(e.get('longitude'))));
        e = e.set('latitude', parseFloat(decrypt(e.get('latitude'))));
        e = e.set('explanation', decrypt(e.get('explanation')));
        new_data = new_data.set(i, e);
      }

      // updated data for list of emergencies already in display
      var old_data_update = Immutable.fromJS(payload).get('old_emergencies');
      for (var i = 0; i < old_data_update.size; i++) {
        var e_updated = old_data_update.get(i);
        var e_previous = current_list.get(i);

        if(e_updated.get('id') != e_previous.get('id')) {
            alert("Update invalid.");
        }

        // only update these if user's phone is still sending updates
        if(!e_updated.get('done')) {
          e_previous = e_previous.set('longitude', parseFloat(decrypt(e_updated.get('longitude'))));
          e_previous = e_previous.set('latitude', parseFloat(decrypt(e_updated.get('latitude'))));
          e_previous = e_previous.set('explanation', decrypt(e_updated.get('explanation')));
          e_previous = e_previous.set('callme', e_updated.get('callme'));
          e_previous = e_previous.set('location_last_updated', e_updated.get('location_last_updated'));
        }
        e_previous = e_previous.set('handled_status', e_updated.get('handled_status'));
        e_previous = e_previous.set('handled_time', e_updated.get('handled_time'));
        e_previous = e_previous.set('archived', e_updated.get('archived'));

        current_list = current_list.set(i, e_previous)
      }

      // concatenate new and old list of emergencies
      var all_updated_list = new_data.concat(current_list);

      _state = _state.set('emergencies', all_updated_list);
      _state = _state.set('emergencies_loaded', true);
      EmergenciesStore.emitChange();
      break;

    case ActionTypes.EMERGENCIES_COMPONENT_UNMOUNTED:
      _state = get_default_state();
      break;
    case ActionTypes.EMERGENCIES_UNITENTIFIED_ERROR:
      _state = _state.merge(Immutable.fromJS(payload));
      EmergenciesStore.emitChange();
      break;
    default:
      break;
  }

  return true;
});

module.exports = EmergenciesStore;
