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
    //Actions.getReports();
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
    var center = {lat: 41.74702, lng: -72.6902683};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: center
    });

    Actions.mapLoaded({'map': map});
  },

  setMarkers: function(map) {
    // Adds markers to the map.
    // Assumes maximum of 16 different markers at the same time
    var emergencies = this.state.data.get('emergencies');
    var iconLetter = 65; // corresponds to letter A
    for (var i = 0; i < emergencies.size; i++) {
      var iconlink = "blue_Marker" + String.fromCharCode(iconLetter);
      iconLetter++;
      if (iconLetter > 90) { iconLetter = 65; }
      var emergency = emergencies.get(i);

      var marker = new google.maps.Marker({
        position: {lat: emergency.get('latitude'), lng: emergency.get('longitude')},
        map: map,
        icon: '/static/img/markers/' + iconlink + '.png',
        title: emergency.get('name'),
        zIndex: emergency.get('id')
      });
    }
  },

  render: function() {
    if (this.state.data.get('emergencies_loaded')) {
      this.setMarkers(this.state.data.get('map'));
    };

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
              var status = item.get('status');

              var link = "/emergency/" + id;

              return (
                  <Link to={link} key={id}>
                    <div className="emergency-container">
                      <div className="name">{name} ({phone})</div>
                      <div className="id_num">ID: {id_num}</div>
                      <div className="status">Status: {status}</div>
                      <div className="time"></div>
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