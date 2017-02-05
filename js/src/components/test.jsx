'use strict';

var Immutable = require('immutable');
var React = require('react');
var mui = require('material-ui');

function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

function bin2String(array) {
  return String.fromCharCode.apply(String, array);
}


var Test = React.createClass({
  clearError: function() {
    this.props.clearError();
  },

  componentDidMount: function() {
    this.rsaInit();

    this.getkey();
  },

  rsaInit: function() {
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
      console.log(keyPair.publicKey);
      console.log(keyPair.privateKey);

      

      window.crypto.subtle.exportKey('jwk', keyPair.privateKey).
      then(function(jwk) {
          //var ba = new Uint8Array(spki);
          //console.log(ba);
          //console.log(bin2String(ba));
          console.log(jwk);
      }).
      catch(function(err) {
          alert(err.message);
      });

      
    }).
    catch(function(err) {
      alert("Could not create and save new key pair: " + err.message);
    });
  },

  getkey: function() {
    $.ajax({
      type: "GET",
      url: '/rsa-test2',
      success: function(res) {
        console.log("getkey");
        console.log(res);

        var publicKeyJwk = res.public_key;
        console.log(publicKeyJwk);
        window.crypto.subtle.importKey(
          "jwk",
          publicKeyJwk,
          {
            name: "RSA-OAEP",
            hash: {name: "SHA-256"}
          },
          true,
          ["encrypt"]
        ).then(function(publicKey) {
          console.log(publicKey);
        }).
        catch(function(err) {
          alert(err.message);
        });

        //crypto.importKey(format, keyData, algo, extractable, usages);

      },
      error: function(res) {
        console.log('getkey: some unidentified error');

      }
    });
  },

  render: function() {

    return (
      <div>
        asdfasdf
      </div>
    );
  }
});


module.exports = Test;