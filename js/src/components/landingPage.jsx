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
    Actions.getRecords();
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

  render: function() {
    var records = this.state.data.get('records');
    return (
      <div>
        <br />
        <br />
        <h3>Emergency Recrods</h3>
        <mui.List>
            {records.map((item) => {
              var id = String(item.get('id'));
              var lat = item.get('latitude');
              var lng = item.get('longitude');
              var timestamp = item.get('created')

              return (
                  <div key={id}>
                    <p>ID: {id}</p>
                    <p>Timestamp: {timestamp}</p>
                    <p>Location: lat={lat} & lng={lng}</p>
                    <hr />
                  </div>
                )
            })}
          </mui.List>
      </div>
    );
  }
});

module.exports = LandingPage;