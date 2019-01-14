import React from "react";
import { List } from "react-virtualized";


function defaultEasing(delta) {
  return delta;
}

// function easeInOutQuint(t) {
//   return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
// }

function easeOutQuint(t) { return 1+(--t)*t*t*t*t }


export default class AnimatedList extends React.Component {
  static defaultProps = {
    duration: 100,
    easing: easeOutQuint,
    onAnimationComplete: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      scrollTop: null
    };

    this._onScroll = this._onScroll.bind(this);
    this._setRef = this._setRef.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollToRow) {
      this._initAnimation();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.scrollToRow !== prevProps.scrollToRow) {
      this._initAnimation();
    }
  }

  render() {
    return (
      <List
        {...this.props}
        onScroll={this._onScroll}
        ref={this._setRef}
        scrollToRow={undefined}
        scrollTop={this.state.scrollTop}
      />
    );
  }

  _animate() {
    requestAnimationFrame(() => {
      const { duration,easing } = this.props;
      const now = performance.now();
      const ellapsed = now - this._animationStartTime;
      const scrollDelta = this._scrollTopFinal - this._scrollTopInitial;
      const easedTime = easing(Math.min(1, ellapsed / duration));
      const scrollTop = this._scrollTopInitial + scrollDelta * easedTime;

      this.setState({ scrollTop });

      if (ellapsed < duration) {
        this._animate();
      } else {
        this._animationStartTime = undefined;
        this._scrollTopInitial = this._scrollTopFinal;
      }
    });
  }

  _initAnimation() {
    if (this._animationStartTime) {
      throw Error('Animation in progress'); // You handle this however you want.
    }

    const {scrollToRow} = this.props;

    this._animationStartTime = performance.now();

    // Ask List for the offset in case it's complex;
    // eg CellMeasurer might be involved and we don't want to duplicate effort
    this._scrollTopFinal = this._list.getOffsetForRow({
      index: scrollToRow
    });

    this._animate();
  }

  _onScroll({ scrollTop }) {
    if (!this._animationStartTime) {
      this._scrollTopInitial = scrollTop;
    }
  }

  _setRef(list) {
    this._list = list;
  }
}

// AnimatedList.propTypes = {
//   duration: React.PropTypes.number.isRequired,
//   easing: React.PropTypes.func.isRequired,
//   scrollToRow: React.PropTypes.number
// };

// AnimatedList.defaultProps = {
//   duration: 1000,
//   easing: defaultEasing
// };

function easeInOutQuint(t) {
  return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;
}

function rowRenderer({ index, isScrolling, key, style }) {
  style.display = 'flex';
  style.alignItems = 'center';
  style.borderBottom = '1px solid #ddd';
  style.padding = '0 0.5em';

  return (
    <div
      className='Row'
      key={key}
      style={style}
    >
      Row {index}
    </div>
  );
}

// class DemoApp extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//     this._jumpToRandom = this._jumpToRandom.bind(this);
//   }

//   render () {
//     return (
//       <div>
//         <button onClick={this._jumpToRandom}>
//           Jump to random
//         </button>
//         <AnimatedList
//           className='List'
//           duration={2500}
//           easing={easeInOutQuint}
//           width={300}
//           height={300}
//           rowCount={10000}
//           rowHeight={30}
//           rowRenderer={rowRenderer}
//           scrollToRow={this.state.scrollToRow}
//           style={{
//             backgroundColor: '#eee'
//           }}
//         />
//       </div>
//     );
//   }

//   _jumpToRandom() {
//     const scrollToRow = Math.round(Math.random() * 999);
//     this.setState({ scrollToRow })
//   }
// }

// ReactDOM.render(
//   <DemoApp/>,
//   document.getElementById('example')
// );
