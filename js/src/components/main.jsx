'use strict';

var React = require('react');
var mui = require('material-ui');

var Header = require('./header.jsx');


var Main = React.createClass({
  render: function() {

    return (
      <div>
      	<Header />
      	{this.props.children}
      </div>
    );
  }
});


module.exports = Main;