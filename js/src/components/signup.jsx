'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Forge = require('node-forge');

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
    this.createRSAKeys();
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

  createRSAKeys: function() {
    // generate rsa keypair
    var rsa = Forge.pki.rsa;
    var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001, workers: -1});
    
    // prepare public key pem to be sent to server
    var pem = Forge.pki.publicKeyToPem(keypair.publicKey);
    Actions.updateFieldInfo({'public_key': pem});

    // save private key pem to local storage
    var pem2 = Forge.pki.privateKeyToPem(keypair.privateKey);
    localStorage.setItem("admin_private_key", pem2);
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
