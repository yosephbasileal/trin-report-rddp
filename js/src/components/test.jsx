'use strict';

var Immutable = require('immutable');
var React = require('react');
var mui = require('material-ui');

var Forge = require('node-forge');

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

function decryptRSA(encryptedString, privateKey) {
     var decrypted = privateKey.decrypt(Forge.util.decode64(encryptedString), 'RSA-OAEP', {
         md: Forge.md.sha256.create(),
         mgf1: {
             md: Forge.md.sha256.create()
         }
     });
     return decrypted;
 }

function doRSA(stringToBeEncrypted, pubkey) {
    var publicKey = Forge.pki.publicKeyFromPem(pubkey);
    var buffer = Forge.util.createBuffer(stringToBeEncrypted, 'utf8');
    var binaryString = buffer.getBytes();
    var encrypted = publicKey.encrypt(binaryString, 'RSA-OAEP', {
        md: Forge.md.sha256.create(),
        mgf1: {
            md: Forge.md.sha256.create()
        }
    });
    return Forge.util.encode64(encrypted);
}


var Test = React.createClass({
  clearError: function() {
    this.props.clearError();
  },

  componentDidMount: function() {
    //this.rsaInit();

    //this.getkey();
    //this.generate();

    //this.getcipher();

    //this.getpublickey();
    //this.encryptandsend();

    //var privateKey = Forge.pki.privateKeyFromPem(prv);

    //console.log(this.decryptRSA(ciphertext, privateKey));
  },

/*  rsaInit: function() {
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
  },*/

/*  getkey: function() {
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
  },*/

  generate: function() {
    var rsa = Forge.pki.rsa;
    var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001, workers: -1});
    
    var pem = Forge.pki.publicKeyToPem(keypair.publicKey);
    console.log(pem);
    this.send({"public_key": pem});

    var pem2 = Forge.pki.privateKeyToPem(keypair.privateKey);
    localStorage.setItem("admin_private_key", pem2);

    console.log(pem2);
  },



 send: function(data) {
  $.ajax({
      type: "POST",
      url: '/rsa-test2',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
      },
      error: function(res) {

          console.log('send: some unidentified error');
      
      }
    });

 },

 getcipher: function() {
    $.ajax({
      type: "GET",
      url: '/rsa-test5',
      success: function(res) {
        console.log(res.cipher);

        var prv = localStorage.getItem("admin_private_key");
        var privateKey = Forge.pki.privateKeyFromPem(prv);
        console.log(decryptRSA(res.cipher, privateKey));

      },
      error: function(res) {
        console.log('getkey: some unidentified error');

      }
    });
 },

 getpublickey: function() {
    $.ajax({
      type: "GET",
      url: '/rsa-test7',
      success: function(res) {
        console.log(res.public_key);

        localStorage.setItem("app_public_key", res.public_key);

      },
      error: function(res) {
        console.log('getkey: some unidentified error');

      }
    });
 },

   encryptandsend: function() {
    var pub = localStorage.getItem("app_public_key");
    var stringToBeEncrypted = "this is plain text";
    var cipher = doRSA(stringToBeEncrypted, pub);
    console.log(cipher);
    this.sendcipher({'cipher':cipher})
  },

  sendcipher: function(data) {
  $.ajax({
      type: "POST",
      url: '/rsa-test8',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
      },
      error: function(res) {

          console.log('send: some unidentified error');
      
      }
    });

 },

 testAES: function() {
  var cipher_str = "iBlycURly89ne4ln8Yk9OQ==";
  var key_str = "1eLAQJPtZrPaAl1r8mHB/i6zzdfVc2egM0ljFCoP68U=";
  var iv_str = "Q4IETaMBSicPUmseLUhkWw==";

  /*var buffer = Forge.util.createBuffer(cipher_str, 'utf8');
  var cipher = buffer.getBytes();

  var buffer2 = Forge.util.createBuffer(iv_str, 'utf8');
  var iv = buffer2.getBytes();

  var buffer3 = Forge.util.createBuffer(key_str, 'utf8');
  var key = buffer3.getBytes();*/

  var key = Forge.util.decode64(key_str);
  var iv = Forge.util.decode64(iv_str);
  var cipher = Forge.util.decode64(cipher_str);
  console.log(key);
  console.log(iv);
  console.log(cipher);

  var decipher = Forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({iv: iv});
  decipher.update(Forge.util.createBuffer(cipher));
  decipher.finish();

  console.log(decipher.output);

 },

  getImage: function() {
  $.ajax({
      type: "GET",
      url: '/test-file',
      contentType: "application/json; charset=utf-8",
      success: function(res) {
        //console.log(res);
        var key_str = "cwP6VilrtbRDpqIPreAnoFQi61tiTo2ZMWRI3mIPMjg=";
        var iv_str = "aLh0yYW673T7N8EdnFb9KA==";
        var key = Forge.util.decode64(key_str);
        var iv = Forge.util.decode64(iv_str);
        var cipher = Forge.util.decode64(res);
        //console.log(key);
        //console.log(iv);
        //console.log(cipher);

        var decipher = Forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: iv});
        decipher.update(Forge.util.createBuffer(cipher));
        decipher.finish();

        var image = new Image();
        image.src = 'data:image/png;base64,'+ decipher.output.data;
        document.body.appendChild(image);

      },
      error: function(res) {

          console.log(res);
      
      }
    });

 },


  render: function() {

    return (
      <div>
        <mui.RaisedButton
          label="Get public key"
          primary={true}
          onTouchTap={this.getpublickey}
        />
        <mui.RaisedButton
          label="encrypt and send"
          primary={true}
          onTouchTap={this.encryptandsend}
        />
        <mui.RaisedButton
          label="TestAES"
          primary={true}
          onTouchTap={this.testAES}
        />
        <mui.RaisedButton
          label="Get Image"
          primary={true}
          onTouchTap={this.getImage}
        />
      </div>
    );
  }
});


module.exports = Test;