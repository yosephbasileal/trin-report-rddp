'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/emergencyDialogStore');
var Actions = require('../actions/emergencyDialogActions');

var styles = {
  dialog: {
    'width': 1200,
    'maxWidth': 'none',
    'backgroundColor': '#f5f5f5'
  },
  minimap: {
    'width': 400,
    'height': 400
  }
};

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

var EmergencyDialog = React.createClass({
  getInitialState: function() {
    Actions.getEmergencyData(this.props.params.emergency_id);
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
  },

  initMiniMap: function() {
    //{lat: 41.74702, lng: -72.6902683};
    var lat = this.state.data.get('emergency').get('latitude');
    var lng = this.state.data.get('emergency').get('longitude');
    console.log(lat);
    console.log(lng);
    var location = {lat: lat, lng: lng};
    var minimap = new google.maps.Map(document.getElementById('minimap'), {
      zoom: 17,
      center: location
    });
    var marker = new google.maps.Marker({
      position: location,
      map: minimap
    });
  },

  componentWillUnmount: function() {
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
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

  render: function() {
    if (this.state.data.get('data_loaded')) {
      this.initMiniMap();
    }

    var actions = [];
    var emergency = this.state.data.get('emergency');

    var id = String(emergency.get('id'));
    var name = emergency.get('name');
    var id_num = emergency.get('id_num');
    var phone = emergency.get('phone');
    var email = emergency.get('email');
    var dorm = emergency.get('dorm');
    var lat = emergency.get('latitude');
    var lng = emergency.get('longitude');
    var timestamp = emergency.get('created');
    var status = emergency.get('status');

    var title = "Emergency Request #: " + id;

    return (
      <div>
        <mui.Dialog
          title={title}
          actions={actions}
          modal={true}
          open={this.state.data.get("open")}
          onRequestClose={this.handleClose}
          contentStyle={styles.dialog}
        >
          <div className="col-xs-4 info-col">
            <div className="row">
              <div>Received at: {timestamp}</div>
              <br />
              <div>Last known location: Lat {lat} Lng {lng}</div>
              <div>Last updated: {timestamp}</div>
            </div>

            <br />

            <div className="row">
              <div>Student Name: {name}</div>
              <div>ID Number: {id_num}</div>
              <div>Dorm: {dorm}</div>
              <div>Phone: {phone}</div>
              <div>Email: {email}</div>
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
                secondary={true}
              />
            </div>
          </div>
          <div className="col-xs-4">
            <div style={styles.minimap} id="minimap">
            </div>
          </div>
          <div className="col-xs-4">
            
          </div>
          <div className="dialog-close-button">
            <Link to="/">[X]</Link>
          </div>
        </mui.Dialog>
      </div>
    );
  }
});

module.exports = EmergencyDialog;