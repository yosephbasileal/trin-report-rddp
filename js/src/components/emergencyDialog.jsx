'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/emergencyDialogStore');
var Actions = require('../actions/emergencyDialogActions');

var styles = {
  dialog: {
    'width': 1000,
    maxWidth: 'none',
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
    //Actions.getEmergency();
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
    this.initMiniMap();
  },

  initMiniMap: function() {
    //var lat = this.state.data.get('report').get('latitude');
    //var lng = this.state.data.get('report').get('longitude');
    var location = {lat: 41.74702, lng: -72.6902683};
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
    var actions = [];

    return (
      <div>
        <mui.Dialog
          title="Emergency Request from Basileal Imana"
          actions={actions}
          modal={true}
          open={this.state.data.get("open")}
          onRequestClose={this.handleClose}
          contentStyle={styles.dialog}
        >
          <div className="col-xs-6">
            <Link to="/">close</Link>
            <mui.RaisedButton
              label="Mark as Received"
              primary={true}
              onTouchTap={this.onMarkAsRecieved}
            />
          </div>
          <div className="col-xs-6">
            <div style={styles.minimap} id="minimap">
            </div>
          </div>
        </mui.Dialog>
      </div>
    );
  }
});

module.exports = EmergencyDialog;