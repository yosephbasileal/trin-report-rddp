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

// Components that shows a list of incident reports
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
        <div className="row report-list-container">

          <div className="row refresh-row">
            <span>
              <h3 style={{'display': 'inline-block'}}>Pending Incident Reports</h3>
              <mui.RaisedButton
                label="Refresh"
                onTouchTap={this.onRefreshClicked}
                primary={true}
                style={{'marginLeft': '40px'}}
              />
            </span>
          </div>
          {reports.map((item, index) => {
            var dummy_id = String(item.get('id_dummy'));
            var id = String(item.get('id'));
            var type = item.get('type');
            var urgency = item.get('urgency');
            var date = item.get('date')

            var link = "/reports/" + id + "?index=" + index;

            var color = "rgba(0, 128, 0, 0.86)";
            if (urgency == "medium") {
              color = "rgba(255, 255, 0, 0.86)";
            } else if(urgency == "high") {
              color = "rgba(255, 0, 0, 0.86)";
            }

            console.log(color);

            return (
                <div className="col-xs-3 report-list-item">
                  <Link to={link} key={id}>
                    <div key={id} className="report-container">
                      <p><b>Type:</b> {type}</p>
                      <p><b>Urgency:</b> {urgency}</p>
                      <p><b>Date:</b> {date}</p>
                      <div className="urgency-indicator" style={{'backgroundColor': color}}></div>
                    </div>
                  </Link>
                </div>
              )
          })}
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