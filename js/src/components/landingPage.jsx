'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/landingStore');
var Actions = require('../actions/landingActions');

var LandingPage = require('./landingPage.jsx');

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

var LandingPage = React.createClass({
  getInitialState: function() {
    Actions.getEmergencies();
    Actions.getReports();
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
    this.initMap();
  },

  componentWillUnmount: function() {
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
  },

  handleStoreChange: function() {
    this.setState(getStateFromStore());
  },

  initMap: function() {
    var uluru = {lat: 41.74702, lng: -72.6902683};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  },

  render: function() {
    var reports = this.state.data.get('reports');
    var emergencies = this.state.data.get('emergencies');
    return (
      <div>
        <div className="emergency-list-container">
          <mui.List>
            {emergencies.map((item) => {
              var id = String(item.get('id'));
              var name = item.get('name');
              var id_num = item.get('id_num');
              var phone = item.get('phone');
              var lat = item.get('latitude');
              var lng = item.get('longitude');
              var timestamp = item.get('created');

              var link = "/emergency/" + id;

              return (
                  <Link to={link}>
                    <div className="emergency-container">
                      <div className="name">Basileal Imana (3215916890)</div>
                      <div className="user-id">ID: 1478429</div>
                      <div className="time">{timestamp}</div>
                      <div className="map-link">Status: not handled</div>
                    </div>
                  </Link>
                )
            })}
          </mui.List>
        </div>

        <div className="map" id="map">

        </div>

        <div className="report-list-container">
          <mui.List>
            {reports.map((item) => {
              var id = String(item.get('id'));
              var lat = item.get('latitude');
              var lng = item.get('longitude');
              var timestamp = item.get('created')

              return (
                  <div key={id} className="report-conainer">
                    <p>ID: {id}</p>
                    <p>Timestamp: {timestamp}</p>
                    <p>Location: lat={lat} & lng={lng}</p>
                  </div>
                )
            })}
          </mui.List>
        </div>

        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = LandingPage;