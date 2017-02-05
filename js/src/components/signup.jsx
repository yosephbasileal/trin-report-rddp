'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

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
    var algorithmName = "RSA-OAEP";
    var usages = ["encrypt", "decrypt"];
    window.crypto.subtle.generateKey(
      {
        name: algorithmName,
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),  // 24 bit representation of 65537
        hash: {name: "SHA-256"}
      },
      true,  // Cannot extract new key
      usages
    ).
    then(function(keyPair) {
      // convert public key to jwk format
      window.crypto.subtle.exportKey('jwk', keyPair.publicKey).
      then(function(jwk) {
          console.log(jwk);
          var change = {'public_key': jwk};
          Actions.updateFieldInfo(change);
      }).
      catch(function(err) {
          alert(err.message);
      });

      //TODO: store private key locally

      // convert private key to jwk format
      //window.crypto.subtle.exportKey('jwk', keyPair.privateKey).
/*      then(function(jwk) {
          console.log(jwk);
          Actions.saveKey()
      }).
      catch(function(err) {
          alert(err.message);
      });*/

      
    }).
    catch(function(err) {
      alert("Could not create and save new key pair: " + err.message);
    });
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
