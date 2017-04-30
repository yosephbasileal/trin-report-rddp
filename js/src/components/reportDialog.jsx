'use strict';

var React = require('react');
var Link = require('react-router').Link;
var mui = require('material-ui');

var Store = require('../stores/reportDialogStore');
var Actions = require('../actions/reportDialogActions');

var RSA = require('../actions/rsa');

var styles = {
  dialog: {
    'max-width': 1200,
    'width': 'auto',
    'maxWidth': 'none',
    'backgroundColor': '#f5f5f5'
  }
};

function scorllDivToBottom() {
  $(".messages-div").scrollTop($(".messages-div")[0].scrollHeight);
}

function getStateFromStore() {
  return {
    data: Store.getState(),
  };
}

// Components that shows a dialog with more info of an incident report
var ReportDialog = React.createClass({
  getInitialState: function() {
    Actions.getMessages(this.props.params.report_id);
    Actions.getImages(this.props.params.report_id);
    this.getData(this.props.params.report_id);
    return getStateFromStore();
  },

  componentDidMount: function() {
    Store.listen(this.handleStoreChange);
  },

  getData: function(r_id) {
    var data = {
      'report': this.props.getReportData(r_id),
      'report_loaded':  true
    };
    Actions.saveData(data);
  },

  componentWillReceiveProps: function(nextProps) {
    this.getData(this.props.params.report_id);
  },

  componentWillUnmount: function() {
    Actions.componentUnmounted();
    Store.unlisten(this.handleStoreChange);
  },

  handleStoreChange: function() {
    this.setState(getStateFromStore());
    if(this.state.data.get('report')) {
      if(this.state.data.get('report').get('followup_initiated')) {
        scorllDivToBottom();
      }
    }
  },

  handleClose: function() {
    var change = {'open': false};
    Actions.handleClose(change);
  },

  onMarkAsArchived: function() {
    var data = {
      'report_id': this.props.params.report_id
    };
    Actions.onMarkAsArchived(data);
  },

  onFollowupClicked: function() {
    var data = {
      'report_id': this.props.params.report_id
    };
    Actions.initiateFollowup(data);
  },

  onRefreshClicked: function() {
    Actions.getMessages(this.props.params.report_id);
  },

  sendMessage: function() {
    var message = this.state.data.get('message');
    if (message === "") {
      var data = {
        'message_error': 'Please enter message'
      };
      Actions.saveData(data);
      return;
    }

    var admin_public_key_pem = localStorage.getItem('admin_public_key');
    var user_public_key_pem = this.state.data.get('report').get('user_pub_key');

    var data = {
      'message_user': RSA.encrypt(message, user_public_key_pem),
      'message_admin': RSA.encrypt(message, admin_public_key_pem),
      'report_id': this.props.params.report_id
    }
    Actions.sendMessage(data);
  },

  updateMessage: function(change) {
    Actions.updateMessage(change);
  },

  render: function() {

    var report = this.state.data.get('report');
    var images = this.state.data.get('images');
    console.log(images);

    var timestamp = "";
    var dummy_id = ""
    var id = "";
    var type = "";
    var urgency = "";
    var date = "";
    var location = "";
    var description = "";
    var is_anonymous = true;
    var follow_up = true;
    var is_res_emp = false;
    var followup_initiated = false;

    var name = "";
    var id_num = "";
    var phone = "";
    var email = "";
    var dorm = "";

    var report_loaded = false;
    if (report) {
      report_loaded = true;
      timestamp = report.get('created');
      id = String(report.get('id'));
      dummy_id = String(report.get('id_dummy'));
      type = report.get('type');
      urgency = report.get('urgency');
      date = report.get('date');
      location = report.get('location');
      description = report.get('description');
      is_anonymous = report.get('is_anonymous');
      follow_up = report.get('follow_up');
      is_res_emp = report.get('is_res_emp');
      followup_initiated = report.get('followup_initiated');
    }

    if(!is_anonymous) {
      name = report.get('reporer_name');
      id_num = report.get('reporter_id_num');
      phone = report.get('reporter_phone');
      email = report.get('reporter_email');
      dorm = report.get('reporter_dorm');
    }

    var title = "Report Request #" + dummy_id;

    var followup_block = '';
    if(followup_initiated) {
      followup_block = (
        <div>
          <Messages
            messages={this.state.data.get('messages')}
          />
          <NewMessage
            sendMessage={this.sendMessage}
            updateFieldInfo={this.updateMessage}
          />
        </div>
        
      );
    } else {
      followup_block = (
        <div></div>
      );
    }

    return (
      <div>
        <mui.Dialog
          title={title}
          actions={[]}
          modal={true}
          open={this.state.data.get("open")}
          onRequestClose={this.handleClose}
          contentStyle={styles.dialog}
          autoScrollBodyContent={true}
        >
          <div className="row" style={{'paddingRight': '20px','paddingLeft': '20px', 'paddingTop': '20px'}}>
            <div className="col-sm-4 info-col">
              <div className="row">
                <div><b>Received at:</b> {timestamp}</div>
                <br />
                <div><b>Type:</b> {type}</div>
                <div><b>Urgency:</b> {urgency}</div>
                <div><b>Incident date:</b> {date}</div>
                <div><b>Incident location:</b> {location}</div>
                <div><b>Description:</b> {description}</div>
              </div>

              <br />

              <div className="row">
                <div><b>Name:</b> {name}</div>
                <div><b>ID #:</b> {id_num}</div>
                <div><b>Phone:</b> {phone}</div>
                <div><b>Email:</b> {email}</div>
                <div><b>Dorm:</b> {dorm}</div>
              </div>

              <br />

              <div className="row">
                <mui.RaisedButton
                  label="Archive"
                  onTouchTap={this.onMarkAsArchived}
                  secondary={true}
                />
                &nbsp;&nbsp;&nbsp;
                <mui.RaisedButton
                  label="Refresh Messages"
                  onTouchTap={this.onRefreshClicked}
                  primary={true}
                />
                <br /> <br />
              </div>
            </div>
            <div className="col-sm-6" style={{'padding': '0px'}}>
              {followup_block}
            </div>
            <div className="col-sm-2 images-list-container">
              <h3>Images</h3>
              <div>
                <mui.List>
                  {images.map((item, index) => {
                    var s3_key = item.get('s3_key');
                    var image = item.get('image');
                    var src = 'data:image/png;base64,'+ image;
                    return (
                        <div key={s3_key}>
                          <img src={src} id="image-container" width="70"></img>
                          <br />
                        </div>
                      )
                  })}
                </mui.List>
              </div>
            </div>
            <div className="dialog-close-button">
              <Link to="/home">[X]</Link>
            </div>
          </div>
        </mui.Dialog>
      </div>
    );
  }
});


var Messages = React.createClass({
  render: function() {
    var messages = this.props.messages;

    return (
      <div>
        <h3>Followup Message Window</h3>
        <br />
        <div className="messages-div">
          <mui.List>
            {messages.map((item) => {
              var m_style; // for css style of chat window
              if (item.get('from_admin')) {
                m_style = 'me';
              } else {
                m_style = 'them';
              };

              var id = item.get('id');
              var content = item.get('content');

              return (
                  <div key={id}>
                    <div className={"message-wrapper " + m_style}>
                      <div className="text-wrapper">{content}</div>
                    </div>
                  </div>
                )
            })}
          </mui.List>
        </div>
      </div>
    );
  }
});

var NewMessage = React.createClass({
  sendMessage: function() {
    this.props.sendMessage();
  },

  handleFormChange: function(event, value) {
    var change = {};
    change[event.target.name] = value;
    this.props.updateFieldInfo(change);
  },

  render: function() {
    var state = getStateFromStore();
    return (
      <div className="send-div">
        <div className="col-sm-9" style={{'padding': '0px'}}>
          <mui.TextField
            name="message"
            floatingLabelText="Enter a message"
            floatingLabelFixed={true}
            value={state.data.get('message')}
            errorText={state.data.get('message_error')}
            onChange={this.handleFormChange}
            multiLine={true}
            rows={2}
            rowsMax={2}
            maxLength={150}
            fullWidth={true}
          />
        </div>

        <div className="col-sm-2 send-button" style={{'padding': '0px', 'paddingBottom':'20px'}}>
          <mui.RaisedButton
            label="Send"
            primary={true}
            onTouchTap={this.sendMessage}
            backgroundColor="#337AB7"
          />
        </div>
      </div>
    );
  }
});


module.exports = ReportDialog;
