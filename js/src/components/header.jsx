var React = require('react');
var mui = require('material-ui');
var Link = require('react-router').Link;

var Store = require('../stores/headerStore');
var Actions = require('../actions/headerActions');

var EmergencyActions = require('../actions/emergenciesActions');

// styles
var styles = {
  emergencyButton: {
    'marginTop': 10,
    'marginLeft': 10,
    'marginRight': 5,
    'float': 'left'
  },
  reportButton: {
    'marginTop': 10,
    'marginLeft': 10,
    'marginRight': 20,
    'float': 'left'
  },
  toggleButton: {
    'marginTop': 18,
    'marginLeft': 10,
    'marginRight': 10,
    'float': 'left',
    'width': '270px'
  }
};

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

// Components that shows header (logo, navigation, logout)
var Header = React.createClass({
  getInitialState: function() {
    Actions.checkLogin();
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

  refreshEmergencies: function() {
    EmergencyActions.getEmergencies();
  },

  refreshReports: function() {
    EmergencyActions.getReports();
  },

  handleFormChange: function(event, value) {
    var change = {};
    change[event.target.name] = value;
    Actions.updateFieldInfo(change);
  },

  signOut: function() {
    Actions.signOut();
  },

  render: function() {
    var logged_in = this.state.data.get('logged_in');

    var buttons = '';

    if (!logged_in) {
      buttons = (
        <div>
        </div>
      );
    }
    else if (logged_in) {
      buttons = (
        <div>
          <div style={styles.toggleButton}>
            <mui.Toggle
                defaultToggled={true}
                labelPosition="right"
                label="Auto refresh emergency requests"
                name="auto-refresh"
                toggled={this.state.data.get('auto-refresh')}
                onToggle={this.handleFormChange}
            />
          </div>
          <mui.RaisedButton
            label="Emergency Panel"
            style={styles.emergencyButton}
            primary={true}
            labelColor='#d9af0b'
            labelStyle={{'color': '#d9af0b', 'display': 'inline-block', 'float': 'right'}}
            disabled={this.state.data.get('auto-refresh')}
            onTouchTap={this.refreshEmergencies}
            icon={<RefreshIcon />}
          />
          <mui.RaisedButton
            label="Incident Report Panel"
            style={styles.reportButton}
            primary={true}
            labelColor='#d9af0b'
            labelStyle={{'color': '#d9af0b', 'display': 'inline-block', 'float': 'right'}}
            onTouchTap={this.refreshReports}
            icon={<RefreshIcon />}
          />
          <div className="header-icon-item" onTouchTap={this.signOut}>
            <SignOut />
          </div>
        </div>
      );
    }

    return (
      <div className="header">
        <div className="icon-holder">
          <img src="/static/img/trin_logo.png" width="45" style={{'marginBottom': '10px'}}/>
          &nbsp;&nbsp;
          <h1 style={{'display': 'inline-block', 'paddingTop': '10px'}}>
            <b style={{'color': '#07193c'}}>Trin</b><b style={{'color': '#d9af0b'}}>Report</b>
          </h1>
        </div>
        <div className="pull_right header-menu">
          {buttons}
        </div>
      </div>
    );
  }
});

var RefreshIcon = (props) => (
  <mui.SvgIcon {...props} style={{'color': 'rgb(128, 128, 128)','marginTop': '5', 'marginLeft': '8'}}>
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </mui.SvgIcon>
);

var SignOut = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header-name">Log Out</div>
      </div>
    );
  }
});

module.exports = Header;
