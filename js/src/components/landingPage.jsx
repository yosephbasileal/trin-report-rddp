'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/landingStore');
var Actions = require('../actions/landingActions');

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
  },

  componentWillUnmount: function() {
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
  },

  handleStoreChange: function() {
    this.setState(getStateFromStore());
  },

  initMap: function() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  },

  componentWillMount: function() {
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCwHRrYCAqEoG6ebMeZmrrzw44t6zji4EA&callback=initMap";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    },

  render: function() {
    var reports = this.state.data.get('reports');
    var emergencies = this.state.data.get('emergencies');
    return (
      <div>
        <div className="emergency-list-container">
          <div className="emergency-container">
            <div className="name">Basileal Imana (8609995825)</div>
            <div className="user-id">ID: 1478429</div>
            <div className="time">2 min ago</div>
            <div className="map-link"><a href="#">Show on map</a></div>
          </div>

          <div className="emergency-container">
            <p>ID: 1234</p>
            <p>Timestamp: today</p>
            <p>Location: lat=12 & lng=13</p>
          </div>

          <div className="emergency-container">
            <p>ID: 1234</p>
            <p>Timestamp: today</p>
            <p>Location: lat=12 & lng=13</p>
          </div>

          <div className="emergency-container">
            <p>ID: 1234</p>
            <p>Timestamp: today</p>
            <p>Location: lat=12 & lng=13</p>
          </div>

          <div className="emergency-container">
            <p>ID: 1234</p>
            <p>Timestamp: today</p>
            <p>Location: lat=12 & lng=13</p>
          </div>

          <div className="emergency-container">
            <p>ID: 1234</p>
            <p>Timestamp: today</p>
            <p>Location: lat=12 & lng=13</p>
          </div>

          <mui.List>
              {emergencies.map((item) => {
                var id = String(item.get('id'));
                var name = item.get('name');
                var id_num = item.get('id_num');
                var phone = item.get('phone');
                var lat = item.get('latitude');
                var lng = item.get('longitude');
                var timestamp = item.get('created')

                return (
                    <div className="emergency-container">
                      <div className="name">Basileal Imana (8609995825)</div>
                      <div className="user-id">ID: 1478429</div>
                      <div className="time">{timestamp}</div>
                      <div className="map-link"><a href="#">Show on map</a></div>
                    </div>
                  )
              })}
            </mui.List>
          </div>
          <div className="map" id="map">

          </div>
          <div className="report-list-container">
            <div className="report-container">
              <div className="name">Basileal Imana (8609995825)</div>
              <div className="user-id">ID: 1478429</div>
              <div className="time">2 min ago</div>
              <div className="map-link"><a href="#">Show on map</a></div>
            </div>

            

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
      </div>
    );
  }
});

module.exports = LandingPage;