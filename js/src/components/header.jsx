var React = require('react');
var mui = require('material-ui');
var Link = require('react-router').Link;

var Store = require('../stores/headerStore');
var Actions = require('../actions/headerActions');

// styles
var styles = {
  emergencyButton: {
    'marginTop': 10,
    'marginLeft': 10,
    'marginRight': 5,
    'backgroundColor': '#07193c',
    'color': '#d9af0b'
  },
  reportButton: {
    'marginTop': 10,
    'marginLeft': 10,
    'marginRight': 20,
    'backgroundColor': '#07193c',
    'color': '#d9af0b'
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
          <Link to="/emergencies">
            <div className="header-icon-item">
              <mui.RaisedButton
                label="Emergency Panel"
                style={styles.emergencyButton}
                backgroundColor='#f06602'
              />
            </div>
          </Link>
          <Link to="/reports">
            <div className="header-icon-item">
              <mui.RaisedButton
                label="Incident Report Panel"
                style={styles.reportButton}
                backgroundColor='#f06602'
              />
            </div>
          </Link>
          <div className="header-icon-item" onTouchTap={this.signOut}>
            <SignOut />
          </div>
        </div>
      );
    }

    return (
      <div className="header">
        <div className="icon-holder">
          <img src="/static/img/trin_logo.png" width="50" />
          &nbsp;&nbsp;
          <img src="/static/img/logo.png" width="150" />
        </div>
        <div className="pull_right header-menu">
          {buttons}
        </div>
      </div>
    );
  }
});



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
