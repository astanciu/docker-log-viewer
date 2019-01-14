import React from 'react';

import { List, AutoSizer } from 'react-virtualized';
import AnimatedList from './AnimatedList';
// import AnimatedList from './AnimatedListOriginal';

export class LogPanel extends React.Component {
  prevScrollTop=0
  // state = {
  //   scrollToRow: 1
  // };
  list = React.createRef();
  // componentWillReceiveProps(next) {
  //   if (this.props.scrollToRow !== next.scrollToRow) {
  //     this.setState({ scrollToRow: next.scrollToRow });
  //   }
  // }
  animationComplete = () => {};

  onScroll = ({clientHeight, scrollHeight, scrollTop}) => {
    const scrollDiff = scrollTop - this.prevScrollTop
    // if (scrollTop < this.prevScrollTop){
    if (this.props.follow && scrollDiff < -1){
      // Scrolled up, stop following
      this.list.current.stopAnimation()
      this.prevScrollTop = scrollTop;
      
      return this.props.setFollow(false)
    }
    
    const sum = scrollTop+clientHeight
    if (!this.props.follow && scrollHeight - sum < 10){
      // Scrolled to the bottom, start following
      cancelAnimationFrame(this.list.current.raf)
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
          // <List
          //   height={height}
          //   width={width}
          //   rowHeight={20}
          //   rowCount={this.props.logs.length}
          //   rowRenderer={rowRenderer}
          //   onScroll={this.onScroll}
          //   scrollToIndex={this.props.follow ? this.props.logs.length - 1: undefined}
          // />
          <AnimatedList
            ref={this.list}
            height={height}
            width={width}
            rowHeight={20}
            rowCount={this.props.logs.length}
            rowRenderer={rowRenderer}

            scrollToRow={this.props.scrollToRow}
            onScrollParent={this.onScroll}
            
            duration={1000}
          />
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
