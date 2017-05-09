'use strict';

var React = require('react');
var Link = require('react-router').Link;
var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
var GetMuiTheme = require('material-ui/styles/getMuiTheme').default;
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var EmergencyDialog = require('./emergencyDialog.jsx');
var Emergencies = require('./emergencies.jsx');

var ReportDialog = require('./reportDialog.jsx');
var Reports = require('./reports.jsx');

var Main = require('./main.jsx');
var Login = require('./login.jsx');
var Signup = require('./signup.jsx');
var Header = require('./header.jsx');

var Empty = require('./empty.jsx');

var createBrowserHistory = require('history/lib/createBrowserHistory');
var history = createBrowserHistory();

const muiTheme = GetMuiTheme({
    palette: {
        primary1Color: '#07193c',
        primary2Color: '#07193c',
        accent1Color: '#d9af0b',
        pickerHeaderColor: '#d9af0b',
    },
});


// Root components that wraps around everything
var Root = React.createClass({
  render: function() {
    return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
            <Router history={history}>
              <Route path="/" component={Main}>
                <Route path="/home" component={Emergencies}>
                  <IndexRoute  component={Empty} />
                  <Route path="/emergencies/:emergency_id" component={EmergencyDialog}>
                    <IndexRoute  component={Empty} />
                  </Route>
                  <Route path="/reports/:report_id" component={ReportDialog}>
                    <IndexRoute  component={Empty} />
                  </Route>
                </Route>

                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
              </Route>
            </Router>
          </MuiThemeProvider>
        </div>
    );
  }
});

module.exports = Root;
