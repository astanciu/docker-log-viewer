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
    easing: easeInOutQuint,
    onAnimationComplete: () => {}
  };

  listRef = React.createRef();
  animating = false;
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
        scrollToRow={undefined}
        scrollToAlignment="center"
        scrollTop={this.state.scrollTop}
      />
    );
  }

  _animate() {
    this.animating = true;
    this.raf = requestAnimationFrame(() => {
      const { duration, easing } = this.props;
      const now = performance.now();
      if (!this._animationStartTime) return;
      const ellapsed = now - this._animationStartTime;
      if (!this._animationStartTime){
        debugger;
      }
      const scrollDelta = this._scrollTopFinal - this._scrollTopInitial;
      const easedTime = easing(Math.min(1, ellapsed / duration));
      const scrollTop = this._scrollTopInitial + scrollDelta * easedTime;
      this.setState({ scrollTop });

      if (ellapsed < duration) {
        this._animate();
      } else {
        // this._animationStartTime = undefined;
        // this._scrollTopInitial = this._scrollTopFinal;
        // this.props.onAnimationComplete();
        this.stopAnimation();
      }
    });
  }

  _initAnimation() {
    // console.log('Start animation, -this._scrollTopInitial: ', this._scrollTopInitial)
    const { scrollToRow } = this.props;

    if (this.animating) {
      // cancelAnimationFrame(this.raf)
      // this._animationStartTime = undefined;
      // this._scrollTopInitial = this._scrollTopFinal;
      this.stopAnimation()
    }

    this._animationStartTime = performance.now();

    // Ask List for the offset in case it's complex;
    // eg CellMeasurer might be involved and we don't want to duplicate effort
    this._scrollTopFinal = this.listRef.current.getOffsetForRow({
      index: scrollToRow
    });
    
    this._animate();
  }

  stopAnimation(){
    this.animating = false;
    if (this.raf) cancelAnimationFrame(this.raf)
    
    this._animationStartTime = undefined;
    this._scrollTopInitial = this._scrollTopFinal;
  }

  onScroll = (data) => {
    // if (!this._animationStartTime) {
    if (!this.animating){
      this._scrollTopInitial = data.scrollTop;
    }
    if (!this.raf) {
      this._scrollTopInitial = data.scrollTop;
    }
    this.props.onScrollParent(data)
  };
}
