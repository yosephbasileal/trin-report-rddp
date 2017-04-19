'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/emergenciesStore');
var Actions = require('../actions/emergenciesActions');

// global states
var timer;
var map;
var markers = [];
var map_ready = false;

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

// Components that shows a list of emergency requests along with map
var EmergenciesPage = React.createClass({
  getInitialState: function() {
    Actions.getEmergencies();
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
    this.initMap();

    // request updated data every five seconds
    timer = setInterval(function(){
      var list = [];
      var state = getStateFromStore();
      var data = state.data.get('emergencies');
      for (var i = 0; i < data.size; i++) {
        list.push(data.get(i).get('id'));
      }
      Actions.updateEmergencies(list);
    }, 6000);
  },

  componentWillUnmount: function() {
    clearInterval(timer);
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
  },

  handleStoreChange: function() {
    this.setState(getStateFromStore());
  },

  initMap: function() {
    // coordinates of center of Trinity's campus
    var center = {lat: 41.74702, lng: -72.6902683};
    // initialize map
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: center
    });
    this.setMarkers();
  },

  setMarkers: function() {
    this.clearMarkers();
    markers = [];
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
      markers.push(marker);
    }
    map_ready = true;

  },

  clearMarkers: function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  },

  updateMap: function() {
    // respwan markers with new data
    this.setMarkers();
  },

  getEmergencyFromList: function(id) {
    var emergencies = this.state.data.get('emergencies');
    var e = null;
    for (var i = emergencies.size - 1; i >= 0; i--) {
      if (String(emergencies.get(i).get('id')) == id) {
        e = emergencies.get(i);
        break;
      }
    }
    return e;
  },

  render: function() {
    if (this.state.data.get('emergencies_loaded')) {
      if(!map_ready) {
        this.initMap();
        
      } else {
        this.updateMap();  
      }
    }

    var reports = this.state.data.get('reports');
    var emergencies = this.state.data.get('emergencies');

    var iconLetter = 65;

    return (
      <div>
        <div className="emergency-list-container">
          <mui.List>
            {emergencies.map((item, index) => {
              var iconlink = "blue_Marker" + String.fromCharCode(iconLetter);
              var path = '/static/img/markers/' + iconlink + '.png';
              iconLetter++;
              if (iconLetter > 90) { iconLetter = 65; }
              //console.log(path);

              var id = String(item.get('id'));
              var name = item.get('name');
              var id_num = item.get('id_num');
              var phone = item.get('phone');
              var lat = item.get('latitude');
              var lng = item.get('longitude');
              var timestamp = item.get('created');

              var status= "";
              var status_color = "";
              if(item.get('handled_status')) {
                status = "Marked as Received";
                status_color = '#379400';
              } else {
                status= "Pending";
                status_color = '#ff0000'
              };

              var link = "/emergencies/" + id + "?index=" + index;

              return (
                  <Link to={link} key={id}>
                    <div className="emergency-container">
                      <div className="name">{name} ({phone})</div>
                      <div className="id_num">ID #: {id_num}</div>
                      <div className="status">Status: <span style={{'color': status_color}}>{status}</span></div>
                      <div className="pin"><img className="pin-image" src={path} /></div>
                      <div className="time"></div>
                    </div>
                  </Link>
                )
            })}
          </mui.List>
        </div>

        <div className="map" id="map">
        </div>

        <div>
          {React.cloneElement(this.props.children, {
            getData: this.getEmergencyFromList,
            dataLoaded: this.state.data.get('emergencies_loaded')
          })}
        </div>
      </div>
    );
  }
});

module.exports = EmergenciesPage;