import React from "react";
import { List } from "react-virtualized";

function defaultEasing(delta) {
  return delta;
}
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
 function easeOutQuint(t) { return 1+(--t)*t*t*t*t }
export default class AnimatedList extends React.Component {
  static defaultProps = {
    duration: 100,
    easing: easeOutQuint,
    onAnimationComplete: () => {}
  };

  listRef = React.createRef();

  state = {
    scrollTop: null
  };

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
        onScroll={this.onScroll}
        ref={this.listRef}
        scrollToIndex={this.props.scrollToRow}
        // scrollToRow={undefined}
        scrollTop={this.state.scrollTop}
      />
    );
  }

  _animate() {
    requestAnimationFrame(() => {
      const { duration, easing } = this.props;
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
        this.props.onAnimationComplete();
      }
    });
  }

  _initAnimation() {
    const { scrollToRow } = this.props;

    if (this._animationStartTime) {
      // throw Error("Animation in progress"); // You handle this however you want.
      this._scrollTopFinal = this.listRef.current.getOffsetForRow({
        index: scrollToRow
      });
    }


    this._animationStartTime = performance.now();

    // Ask List for the offset in case it's complex;
    // eg CellMeasurer might be involved and we don't want to duplicate effort
    this._scrollTopFinal = this.listRef.current.getOffsetForRow({
      index: scrollToRow
    });

    this._animate();
  }

  onScroll = (data) => {
    // if (!this._animationStartTime) {
    //   this._scrollTopInitial = data.scrollTop;
    // }
    this.props.onScroll(data)
  };
}
