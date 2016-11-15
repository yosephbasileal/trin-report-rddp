'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/loginStore');
var Actions = require('../actions/loginActions');

var ErrorBox = require('./error.jsx');

var styles = {
  button: {
    'marginTop': '20px',
    'marginBottom': '30px'
  }
};

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

var Login = React.createClass({
  getInitialState: function() {
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

  onSubmitButtonClick: function() {
    Actions.submitLoginInfo(
      this.state.data
    );
  },

  handleFormChange: function(event, value) {
    var change = {};
    change[event.target.name] = value;
    Actions.updateFieldInfo(change);
  },

  clearError: function() {
    Actions.clearError();
  },

  render: function() {
    return (
        <div className="login-container">
            <div className="wrapper">
                <h1 className="title-wrapper">Login into RDDP</h1>
            </div>
            <div className="wrapper login-wrapper">
                <div className="dynamic-row">
                    <ErrorBox error={this.state.data.get('unidentified_error')} clearError={this.clearError}/>
                    <div className="box">
                        <mui.TextField
                          errorText={this.state.data.get('email_error')}
                          value={this.state.data.get('email')}
                          floatingLabelText="Enter your Email"
			  floatingLabelFixed={true}
                          type="email"
                          fullWidth={true}
                          name="email"
                          onChange={this.handleFormChange}
                        />
                        <mui.TextField
                          errorText={this.state.data.get('password_error')}
                          value={this.state.data.get('password')}
                          floatingLabelText="Enter your Password"
			  floatingLabelFixed={true}
                          type="password"
                          fullWidth={true}
                          name="password"
                          onChange={this.handleFormChange}
                        />
                        <mui.RaisedButton
                          label="Login"
                          primary={true}
                          style={styles.button}
                          fullWidth={true}
                          onTouchTap={this.onSubmitButtonClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
  }
});

module.exports = Login;
