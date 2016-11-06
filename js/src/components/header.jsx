var React = require('react');
var mui = require('material-ui');
var Link = require('react-router').Link;

var Store = require('../stores/headerStore');
var Actions = require('../actions/headerActions');

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

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
          <Link to='/signout'><div className="header-icon-item"><SignOut signOut={this.signOut} /></div></Link>
        </div>
      );
    }

    return (
      <div className="header">
        <div className="icon-holder">
          <img src="/static/img/logo.png" width="150"/>
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
      <div onTouchTap={this.props.signOut}>
        <div className="header-name">Log Out</div>
      </div>
    );
  }
});

module.exports = Header;
