'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Root = require('./components/root.jsx');


var $ = require('jquery');
window.$ = $;
window.jQuery = $;
require('bootstrap');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

ReactDOM.render((
    <Root />
), document.getElementById('app'));
