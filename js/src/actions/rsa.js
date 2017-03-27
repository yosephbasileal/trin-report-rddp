'use strict';

var Forge = require('node-forge');

var RSA = {
  // generates a private and public keypair of provided size
  generateRSAKeyPair: function(keySize) {
    var rsa = Forge.pki.rsa;
    var keypair = rsa.generateKeyPair({bits: keySize, e: 0x10001, workers: -1});
    return keypair; 
  },

  // takes public key object and converts to a string in pem format
  createStringFromPublicKey: function(publicKey) {
    var pemstr = Forge.pki.publicKeyToPem(publicKey);
    return pemstr;
  },

  // takes public key object and converts to a string in pem format
  createStringFromPrivateKey: function(privateKey) {
    var pemstr = Forge.pki.privateKeyToPem(privateKey);
    return pemstr;
  },

  // takes a plaintext and a public key (pem formatted string) and returns encrypted ciphertext
  encrypt: function(plainText, pubKeyPem) {
    return this.encryptRSA(this.createPublicKeyFromString(pubKeyPem), plainText);
  },

  // takes a cihertext and a private key (pem formatted string) and returns decrypted plaintext
  decrypt: function(cipherText, prvKeyPem) {
    return this.decryptRSA(this.createPrivateKeyFromString(prvKeyPem), cipherText);
  },

  // takes a plaintext and a public key object and returns encrypted ciphertext (base64)
  encryptRSA: function(publicKey, plainText) {
    var buffer = Forge.util.createBuffer(plainText, 'utf8');
    var binaryString = buffer.getBytes();
    var encrypted = publicKey.encrypt(binaryString, 'RSA-OAEP', {
        md: Forge.md.sha256.create(),
        mgf1: {
            md: Forge.md.sha256.create()
        }
    });
    return Forge.util.encode64(encrypted);
  },

  // takes a ciphertext (base64) and a private key object and returns decrypted plaintext
  decryptRSA: function(privateKey, encryptedString) {
    var decrypted = privateKey.decrypt(Forge.util.decode64(encryptedString), 'RSA-OAEP', {
      md: Forge.md.sha256.create(),
      mgf1: {
        md: Forge.md.sha256.create()
      }
    });
    return decrypted;
  },

  // takes a string in pem format and converts it to a public key object
  createPublicKeyFromString: function(publicKeyString) {
    return Forge.pki.publicKeyFromPem(publicKeyString);
  },

  // takes a string in pem format and converts it to a private key object
  createPrivateKeyFromString: function(privateKeyString) {
    return Forge.pki.privateKeyFromPem(privateKeyString);
  },

/*  // takes a plaintext and a symmetric key and returns AES encrypted ciphertext (base64)
  encryptAES: function(key_str, iv_str, plainText) {
    var buffer = Forge.util.createBuffer(plainText, 'utf8');
    var binaryString = buffer.getBytes();
    // TODO: convert key and iv to bytes
    var cipher = Forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(Forge.util.createBuffer(binaryString));
    cipher.finish();
    return cipher.output;
  },

  // takes a AES ciphertext (base64) and a symmetric key object and returns decrypted plaintext
  decryptAES: function(key_str, iv_str encryptedString) {
    var decipher = Forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(Forge.util.decode64(encryptedString));
    decipher.finish();
    return decipher.output;
  },*/  
};

module.exports = RSA;
