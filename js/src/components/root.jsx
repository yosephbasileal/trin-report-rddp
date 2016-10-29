'use strict';

var React = require('react');
var Link = require('react-router').Link;
var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var LandingPage = require('./landingPage.jsx');

var createBrowserHistory = require('history/lib/createBrowserHistory');
var history = createBrowserHistory();


var Root = React.createClass({
  render: function() {
    return (
        <MuiThemeProvider>
          <Router history={history}>
          	<Route path="/" component={LandingPage} />
          </Router>
        </MuiThemeProvider>
    );
  }
});

module.exports = Root;
