'use strict';

var React = require('react');
var mui = require('material-ui');

var Store = require('../stores/reportImageStore');
var Actions = require('../actions/reportImageActions');

var Forge = require('node-forge');

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

var ReportImage = React.createClass({
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

  getImage: function() {
    console.log(this.props.report);
    var img_key = this.props.params.img_key;
    var img_aes_key = this.props.report.get('image_sym_key');
    var img_aes_iv = "DwKcD8uqG6X+b8+zGCqJ0A==";
    console.log(img_key);
    console.log(img_aes_key);
    console.log(img_aes_iv);
    Actions.getImage(img_key, img_aes_key, img_aes_iv);
  },

  render: function() {
    var image_loaded = this.state.data.get('image_loaded');
    var report = this.props.report;
    if(!image_loaded && report.get('id')) {
      this.getImage();
    }

    var image = new Image();
    image.src = 'data:image/png;base64,'+ this.state.data.get('image');
    document.body.appendChild(image);
    return (
      <div id="image-container">
      </div>
    );
  }
});


module.exports = ReportImage;