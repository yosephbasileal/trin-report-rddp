'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var Forge = require('node-forge');

var ReportImageActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.REPORT_IMAGE_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },


  getImage: function(img_key, img_aes_key, img_aes_iv) {
    $.ajax({
      type: "GET",
      url: '/get-image/' + img_key,
      contentType: "application/json; charset=utf-8",
      success: function(res) {
        //console.log(res);
        var key_str = img_aes_key;
        var iv_str = img_aes_iv;
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

        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_IMAGE_DATA_LOADED,
          payload: {
            'image': decipher.output.data,
            'image_loaded': true
          }
        });
      },
      error: function(res) {
        console.log('getImage: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_IMAGES_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }
};

module.exports = ReportImageActions;
