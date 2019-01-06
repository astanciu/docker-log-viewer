import React from 'react';

export class LogPanel extends React.Component {
  renderLogs = () => {
    const wrapStyle = this.props.wrap ? {
      color: '#636b71',
      'whiteSpace': 'pre-line',
      'textIndent': '-30px',
      'marginLeft': '30px'
    } : {}

    return this.props.logs.map((log, i) => {
      return <Log log={log.line} key={log.key} style={wrapStyle} />;
    });
  };
  render() {
    return <>{this.renderLogs()}</>;
  }
}

const Log = ({ log, style }) => {
  return <div className="log" style={style}>{log}</div>;
};
