'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/reportsStore');
var Actions = require('../actions/reportsActions');


function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

var ReportsPage = React.createClass({
  getInitialState: function() {
    Actions.getReports();
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
  },

  onRefreshClicked: function() {
    Actions.getReports();
  },

  componentWillUnmount: function() {
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
  },

  handleStoreChange: function() {
    this.setState(getStateFromStore());
  },

  getReportFromList: function(id) {
    var reports = this.state.data.get('reports');
    var r = null;
    for (var i = reports.size - 1; i >= 0; i--) {
      if (String(reports.get(i).get('id')) == id) {
        r = reports.get(i);
        break;
      }
    }
    return r;
  },

  render: function() {
    var reports = this.state.data.get('reports');

    return (
      <div>
        <div className="row">
          <mui.RaisedButton
            label="Refresh"
            onTouchTap={this.onRefreshClicked}
            primary={true}
          />
        </div>
        <div className="report-list-container">
          <mui.List>
            {reports.map((item, index) => {
              var id = String(item.get('id'));
              var type = item.get('type');
              var urgency = item.get('urgency');
              var date = item.get('date')

              var link = "/reports/" + id + "?index=" + index;

              return (
                  <Link to={link} key={id}>
                    <div key={id} className="report-conainer">
                      <p>ID: {id}</p>
                      <p>Type: {type}</p>
                      <p>Urgency: {urgency}</p>
                      <p>Incident date: {date}</p>
                    </div>
                  </Link>
                )
            })}
          </mui.List>
        </div>

        <div>
          {React.cloneElement(this.props.children, {
            getData: this.getReportFromList,
            dataLoaded: this.state.data.get('reports_loaded')
          })}
        </div>
      </div>
    );
  }
});

module.exports = ReportsPage;