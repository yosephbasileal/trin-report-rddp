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

var timer;
var minimap;
var marker;
var map_ready = false;
var first_time_render = true;

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}



var EmergencyDialog = React.createClass({
  getInitialState: function() {
    //Actions.getEmergencyData(this.props.params.emergency_id);
    this.getData(this.props.params.emergency_id);
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
    //this.initMiniMap();
    // request updated data every five seconds
/*    var self = this;
    timer = setInterval(function(){
      Actions.getEmergencyData(self.props.params.emergency_id);
    }, 5000);*/
  },

  getData: function(e_id) {
  	var data = this.props.getData(e_id);
  	console.log(data);
  	var change = {'emergency': data, 'data_loaded': true};
  	setTimeout(function(){
  		Actions.handleDataReceived(change);
  	},3000);
    
  },

  initMiniMap: function() {
    var lat = this.state.data.get('emergency').get('latitude');
    var lng = this.state.data.get('emergency').get('longitude');
    var location = {lat: lat, lng: lng};
    minimap = new google.maps.Map(document.getElementById('minimap'), {
      zoom: 17,
      center: location
    });
    marker = new google.maps.Marker({
      position: location,
      map: minimap
    });

/*    Actions.saveMapObject({
    	'map': minimap,
    	'marker': marker,
    	'map_ready': true
    })*/
  },

  updateMiniMap: function() {
    var lat = this.state.data.get('emergency').get('latitude');
    var lng = this.state.data.get('emergency').get('longitude');
    console.log(lat);
    console.log(lng);
    var location = {lat: lat, lng: lng};

    map.center = location;
    marker.setMap(null);
    marker = new google.maps.Marker({
      position: location,
      map: minimap
    });
  },

  componentWillUnmount: function() {
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
    map_ready = false;
		first_time_render = true;
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
  	console.log('redndering');
    var actions = [];
    var emergency = this.state.data.get('emergency');
    console.log(this.state.data.get('data_loaded'));
    console.log(first_time_render);
    console.log(map_ready);
    if (this.state.data.get('data_loaded')) {
    	if(!map_ready && first_time_render) {
    		console.log('initializing');
    		this.initMiniMap();
    		first_time_render = false;
    	} else {
    		console.log('update');
    		this.updateMiniMap();
    	}
    }

    var id = String(emergency.get('id'));
    var name = emergency.get('name');
    var id_num = emergency.get('id_num');
    var phone = emergency.get('phone');
    var lat = emergency.get('latitude');
    var lng = emergency.get('longitude');
    var timestamp_location = emergency.get('location_last_updated');
    var timestamp = emergency.get('created');
    var explanation = emergency.get('explanation');
    var callme = emergency.get('callme');
    console.log("callme");
    console.log(callme);
    var callmetext = "";
    if (callme == 1) {
    	callmetext = "yes";
    } else {
    	callmetext = "no";
    }

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
            <Link to="/">[X]</Link>
          </div>
        </mui.Dialog>
      </div>
    );
  }
});

module.exports = EmergencyDialog;