'use strict';

var React = require('react');
var Link = require('react-router').Link;
var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var EmergencyDialog = require('./emergencyDialog.jsx');
var Emergencies = require('./emergencies.jsx');

var ReportImage = require('./reportImage.jsx');
var ReportDialog = require('./reportDialog.jsx');
var Reports = require('./reports.jsx');

var Login = require('./login.jsx');
var Signup = require('./signup.jsx');
var Header = require('./header.jsx');

var Test = require('./test.jsx');
var Empty = require('./empty.jsx');

var createBrowserHistory = require('history/lib/createBrowserHistory');
var history = createBrowserHistory();


var Root = React.createClass({
  render: function() {
    return (
        <div>
          <Header />
          <MuiThemeProvider>
            <Router history={history}>
              <Route path="/emergencies" component={Emergencies}>
                <IndexRoute  component={Empty} />
                <Route path=":emergency_id" component={EmergencyDialog} />  
              </Route>

              <Route path="/reports" component={Reports}>
                <IndexRoute  component={Empty} />
                <Route path=":report_id" component={ReportDialog}>
                  <IndexRoute  component={Empty} />
                  <Route path="img/:img_key" component={ReportImage} />
                </Route>
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
