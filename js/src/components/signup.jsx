'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var RSA = require('../actions/rsa');

var Store = require('../stores/signupStore');
var Actions = require('../actions/signupActions');

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

var Signup = React.createClass({
  getInitialState: function() {
    this.generateRSAKeys();
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

  generateRSAKeys: function() {
    // generate rsa keypair
    var keypair = RSA.generateRSAKeyPair(2048);
    
    // prepare public key pem to be sent to server
    var publicKeyPem = RSA.createStringFromPublicKey(keypair.publicKey);
    Actions.updateFieldInfo({'public_key': publicKeyPem});

    // save private key pem to local storage
    var privateKeyPem = RSA.createStringFromPrivateKey(keypair.privateKey);
    localStorage.setItem("admin_private_key", privateKeyPem);
    localStorage.setItem("admin_public_key", publicKeyPem);
  },

  onSubmitButtonClick: function() {
    Actions.submitSignupInfo(
      this.state.data.get('form')
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
                <h1 className="title-wrapper">Create admin user</h1>
            </div>
            <div className="wrapper login-wrapper">
                <div className="dynamic-row">
                    <ErrorBox error={this.state.data.get('unidentified_error')} clearError={this.clearError}/>
                    <div className="box">
                        <mui.TextField
                          type="text"
                          name="email"
                          errorText={this.state.data.get('form').get('email_error')}
                          value={this.state.data.get('form').get('email')}
                          fullWidth={true}
                          floatingLabelText="Enter your email"
                          onChange={this.handleFormChange}
                          floatingLabelFixed={true}
                        />
                        <mui.TextField
                          type="password"
                          name="pass"
                          errorText={this.state.data.get('form').get('pass_error')}
                          value={this.state.data.get('form').get('pass')}
                          fullWidth={true}
                          floatingLabelText="Enter a password"
                          onChange={this.handleFormChange}
                          floatingLabelFixed={true}
                        />
                        <mui.RaisedButton
                          label="Create Account"
                          primary={true}
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

module.exports = Signup;
