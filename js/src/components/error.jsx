'use strict';

var React = require('react');
var mui = require('material-ui');

// styles
var styles = {
  errorIcon: {
    'marginTop': '10px',
    'marginRight': '10px',
    'color': '#6f6a6a',
    'float': 'left'
  },

  errorClear: {
    'position': 'absolute',
    'right': '5px',
    'top': '10px',
    'color': '#6f6a6a',
    'fontSize': '8px',
    'padding': '4px',
    'fontWeight': '800',
    'cursor': 'pointer'
  }
};

// Component that shows error when form submission encounters error
var ErrorBox = React.createClass({
  clearError: function() {
    this.props.clearError();
  },

  render: function() {
    $('.login-error-box-containter').show();
    var box = <div></div>;
    var error = this.props.error;
    if(error) {
      box = (
          <div className="form-error-box">
            <div className="error-text-wrapper">
              <ErrorIcon style={styles.errorIcon} />
              <b className="error-text">Something went wrong. Please try again!</b>
            </div>
            <ClearIcon style={styles.errorClear} onTouchTap={this.clearError}/>
          </div>
        );
    };
    return (
      <div className="login-error-box-containter">
        {box}
      </div>
    );
  }
});

var ErrorIcon = (props) => (
  <mui.SvgIcon {...props}>
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
  </mui.SvgIcon>
);

var ClearIcon = (props) => (
  <mui.SvgIcon {...props}>
    <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
  </mui.SvgIcon>
);

module.exports = ErrorBox;