'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/emergencyDialogStore');
var Actions = require('../actions/emergencyDialogActions');


var styles = {
  dialog: {
    'width': 1000,
    'maxWidth': 'none',
    'backgroundColor': '#f5f5f5'
  },
  minimap: {
    'width': 400,
    'height': 400
  }
};


var minimap = null;
var marker = null;
var map_ready = false;
var emergency = null;
var emergency_loaded = false;

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

var EmergencyDialog = React.createClass({
  getInitialState: function() {
    this.getData(this.props.params.emergency_id);
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
    this.initMiniMap();
  },

  getData: function(e_id) {
    emergency = this.props.getData(e_id);
    emergency_loaded = true;
  },

  initMiniMap: function() {
    var center = {lat: 41.74702, lng: -72.6902683};
    minimap = new google.maps.Map(document.getElementById('minimap'), {
      zoom: 16,
      center: center
    });
    marker = new google.maps.Marker({
      map: minimap,
    });
    map_ready = true;
    this.updateMiniMap();
  },

  updateMiniMap: function() {
    var lat = emergency.get('latitude');
    var lng = emergency.get('longitude');
    var location = {lat: lat, lng: lng};

    marker.setMap(null);
    minimap.setCenter(location);
    minimap.setZoom(17);
    marker = new google.maps.Marker({
      position: location,
      map: minimap
    });
  },

  componentWillUnmount: function() {
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
    map_ready = false;
  },

  componentWillReceiveProps: function(nextProps) {
    this.getData(this.props.params.emergency_id);
  },

  handleStoreChange: function() {
    this.setState(getStateFromStore());
  },

  handleClose: function() {
    var change = {'open': false};
    Actions.handleClose(change);
  },

  onMarkAsRecieved: function() {
    var data = {
      'emergency_id': this.props.params.emergency_id
    };
    Actions.markAsRecieved(data);
  },

  onMarkAsArchived: function() {
    var data = {
      'emergency_id': this.props.params.emergency_id
    };
    Actions.onMarkAsArchived(data);
  },

  render: function() {
    // update map
    if(emergency_loaded) {
      if(map_ready) {
        this.updateMiniMap();
      }
    }

    var id = "";
    var name = "";
    var id_num = "";
    var phone = "";
    var lat = "";
    var lng = "";
    var timestamp_location = "";
    var timestamp = "";
    var explanation = "";
    var callme = "";

    if (emergency) {
      id = String(emergency.get('id'));
      name = emergency.get('name');
      id_num = emergency.get('id_num');
      phone = emergency.get('phone');
      lat = emergency.get('latitude');
      lng = emergency.get('longitude');
      timestamp_location = emergency.get('location_last_updated');
      timestamp = emergency.get('created');
      explanation = emergency.get('explanation');
      callme = emergency.get('callme');
    }

    var title = "Emergency Request #: " + id;
    var callmetext = "";
    if (callme == 1) {
    	callmetext = "yes";
    } else if(callme == 0) {
    	callmetext = "no";
    }

    return (
      <div>
        <mui.Dialog
          title={title}
          actions={[]}
          modal={true}
          open={this.state.data.get("open")}
          onRequestClose={this.handleClose}
          contentStyle={styles.dialog}
        >
          <div className="col-xs-6 info-col">
            <div className="row">
              <div>Received at: {timestamp}</div>
              <br />
              <div>Explanation: {explanation}</div>
              <div>Can talk on the phone: {callmetext}</div>
              <br />
              <div>Last known location: Lat {lat} Lng {lng}</div>
              <div>Last updated: {timestamp_location}</div>
            </div>

            <br />

            <div className="row">
              <div>Name: {name}</div>
              <div>ID Number: {id_num}</div>
              <div>Phone: {phone}</div>
            </div>

            <br />

            <div className="row">
              <mui.RaisedButton
                label="Mark as Received"
                primary={true}
                onTouchTap={this.onMarkAsRecieved}
                disabled={this.state.data.get('receieved')}
              />
              &nbsp;&nbsp;&nbsp;
              <mui.RaisedButton
                label="Archive"
                onTouchTap={this.onMarkAsArchived}
                secondary={true}
              />
            </div>
          </div>
          <div className="col-xs-6">
            <div style={styles.minimap} id="minimap">
            </div>
          </div>
          <div className="dialog-close-button">
            <Link to="/emergencies">[X]</Link>
          </div>
        </mui.Dialog>
      </div>
    );
  }
});

module.exports = EmergencyDialog;
