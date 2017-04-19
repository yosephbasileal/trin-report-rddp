'use strict';

var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var Immutable = require('immutable');
var Forge = require('node-forge');
var RSA = require('../actions/rsa');

var admin_key_pem = localStorage.getItem("admin_private_key");
var decrypt = function(cipher) {
  return RSA.decrypt(cipher , admin_key_pem);
}

var ReportDialogActions = {
  componentUnmounted: function() {
    AppDispatcher.dispatch({
      type: ActionTypes.REPORT_DIALOG_COMPONENT_UNMOUNTED,
      payload: {}
    });
  },

  saveData: function(change) {
    setTimeout(function()
    {
      AppDispatcher.dispatch({
        type: ActionTypes.REPORT_DIALOG_INIT_DATA,
        payload: change
      });
    },
      1
    );
  },

  handleClose: function(change) {
  	AppDispatcher.dispatch({
      type: ActionTypes.REPORT_DIALOG_CLOSE,
      payload: change
    });
  },

  updateMessage: function(change) {
    AppDispatcher.dispatch({
      type: ActionTypes.REPORT_UPDATE_MESSAGE,
      payload: change
    });
  },

  sendMessage: function(data) {
    $.ajax({
      type: "POST",
      url: '/api/rddp/add-new-message',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_SEND_MESSAGE_SUCCESS,
          payload: res
        });
      },
      error: function(res) {
        if (res.status === 400) {
          AppDispatcher.dispatch({
            type: ActionTypes.REPORT_SEND_MESSAGE_FAILED,
            payload: res.responseJSON
          });
        } else {
          console.log('sendMessage: some unidentified error');
          AppDispatcher.dispatch({
            type: ActionTypes.REPORT_SEND_UNITENTIFIED_ERROR,
            payload: {}
          });
        }
      }
    });
  },

  onMarkAsArchived: function(data) {
    $.ajax({
      type: "POST",
      url: '/api/rddp/mark-report-as-archived',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        window.location.href = res.redirect;
      },
      error: function(res) {
        console.log('onMarkAsArchived: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_DIALOG_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },

  initiateFollowup: function(data) {
    $.ajax({
      type: "POST",
      url: '/api/rddp/initiate-report-followup',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(res) {
        console.log(res);
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_FOLLOWUP_INITIATED,
          payload: res
        });
      },
      error: function(res) {
        console.log('initiateFollowup: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_DIALOG_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }, 

  getMessages: function(report_id) {
    $.ajax({
      type: "GET",
      url: '/api/rddp/followup-messages/' + report_id,
      success: function(res) {
        AppDispatcher.dispatch({
          type: ActionTypes.REPORTS_MESSAGES_DATA_LOADED,
          payload: res
        });
      },
      error: function(res) {
        console.log('getMessages: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORTS_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  },

  getImages: function(report_id) {
    $.ajax({
      type: "GET",
      url: '/api/rddp/report-images/' + report_id,
      success: function(res) {
        var images = Immutable.fromJS(res).get('images');
        for (var i = 0; i < images.size; i++) {
          var image = images.get(i);

          // get key, iv and cipher image
          var key_str = decrypt(image.get('aes_key')); // decrypt key
          var iv_str = image.get('iv');
          var cipher_str = image.get('image');
          // decode all three
          var key = Forge.util.decode64(key_str);
          var iv = Forge.util.decode64(iv_str);
          var cipher = Forge.util.decode64(cipher_str);
          // decrypt image
          var decipher = Forge.cipher.createDecipher('AES-CBC', key);
          decipher.start({iv: iv});
          decipher.update(Forge.util.createBuffer(cipher));
          decipher.finish();
          // save decrypted image in list
          image = image.set('image', decipher.output.data);
          images = images.set(i, image);
        }

        AppDispatcher.dispatch({
          type: ActionTypes.REPORT_IMAGES_LOADED,
          payload: {'images': images}
        });

      },
      error: function(res) {
        console.log('getImages: some unidentified error');
        AppDispatcher.dispatch({
          type: ActionTypes.REPORTS_UNITENTIFIED_ERROR,
          payload: {}
        });
      }
    });
  }
};

module.exports = ReportDialogActions;
