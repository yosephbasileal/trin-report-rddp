'use strict';

var React = require('react');
var Link = require('react-router').Link;
var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var EmergencyDialog = require('./emergencyDialog.jsx');
var LandingPage = require('./landingPage.jsx');
var Login = require('./login.jsx');
var Signup = require('./signup.jsx');
var Header = require('./header.jsx');

var Test = require('./test.jsx');

var createBrowserHistory = require('history/lib/createBrowserHistory');
var history = createBrowserHistory();


var Root = React.createClass({
  render: function() {
    return (
        <div>
          <Header />
          <MuiThemeProvider>
            <Router history={history}>
              <Route path="/" component={LandingPage}>
                <Route path="/emergency/:emergency_id" component={EmergencyDialog} />  
              </Route>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />

              <Route path="/test" component={Test} />
              
            </Router>
          </MuiThemeProvider>
        </div>
    );
  }
});

module.exports = Root;
