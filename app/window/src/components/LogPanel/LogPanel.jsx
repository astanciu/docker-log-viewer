import React from 'react';

import { List, AutoSizer } from 'react-virtualized';
import AnimatedList from './AnimatedList';

export class LogPanel extends React.Component {
  prevScrollTop=0
  state = {
    // scrollToRow: 1
  };
  componentWillReceiveProps(next) {
    if (this.props.scrollToRow !== next.scrollToRow) {
      this.setState({ scrollToRow: next.scrollToRow });
    }
  }
  animationComplete = () => {};
  onScroll = ({clientHeight, scrollHeight, scrollTop}) => {
    if (scrollTop < this.prevScrollTop){
      // Scrolled up, stop following
      this.prevScrollTop = scrollTop;
      return this.props.setFollow(false)
    }

    if (scrollTop + clientHeight === scrollHeight){
      // Scrolled to the bottom, start following
      return this.props.setFollow(true)
    }
    this.prevScrollTop = scrollTop;
  }
  render() {
    const wrapStyle = this.props.wrap
      ? {
          color: '#636b71',
          whiteSpace: 'pre-line',
          textIndent: '-30px',
          marginLeft: '30px'
        }
      : {};

    const rowRenderer = ({ index, key, parent, style }) => {
      const logStyle = {
        height: '20px',
        left: '0px',
        position: 'absolute',
        top: '0px',
        width: '100%'
      };

      return (
        <div className="log" style={style} key={key}>
          {this.props.logs[index].line}
        </div>
      );
    };

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            rowHeight={20}
            rowCount={this.props.logs.length}
            rowRenderer={rowRenderer}
            onScroll={this.onScroll}
          />
          // <AnimatedList
          //   height={height}
          //   width={width}
          //   rowHeight={20}
          //   rowCount={this.props.logs.length}
          //   rowRenderer={rowRenderer}
          //   duration={1000}
          //   // onAnimationComplete={this.animationComplete}
          //   // scrollToRow={this.state.scrollToRow}
          //   scrollToRow={this.props.logs.length - 1}
          //   onScroll={this.props.onScroll}
          // />
        )}
      </AutoSizer>
    );
  }
}

const Log = ({ log, style }) => {
  return (
    <div className="log" style={style}>
      {log}
    </div>
  );
};
