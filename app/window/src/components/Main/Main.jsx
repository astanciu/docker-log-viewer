import React from 'react';
import { debounce, throttle } from 'lodash';
import { LogPanel } from '../LogPanel/LogPanel';
import { Button } from 'semantic-ui-react';
const STORE_SIZE = 200;

export class Main extends React.Component {
  test = 1;
  streaming = true;
  queue = [];
  state = {
    logs: [],
    wrap: false,
    autoScroll: true
  };
  constructor() {
    super();
    this.state.logs = this.createLogStore();
  }
  componentWillMount() {
    this.start();

    // setInterval(() => {
    //   this.props.stream.write(this.test++ + ' - Hello, we are adding some log lines. Hello, we are adding some log lines. Hello, we are adding some log lines. Hello, we are adding some log lines.  ')
    // }, 500);
  }
  createLogStore = () => {
    const store = new Array();
    store.name = 'Log Store';
    let p = function() {
      let result = Array.prototype.push.apply(this, arguments);
      // console.log('After push: ', this.length);
      if (this.length >= STORE_SIZE) {
        store.splice(0, store.length - 40);
      }
      // console.log('After push: ', this.length);
      return result;
    };
    store.push = p.bind(store);

    return store;
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.container !== nextProps.container) {
      this.clearLogs();
    }
  }
  componentWillUnmount() {
    this.stop();
    document.removeEventListener('wheel', this.userEvent);
    document.removeEventListener('keydown', this.userEvent);
  }
  componentDidMount() {
    document.addEventListener('wheel', this.userEvent);
    document.addEventListener('keydown', this.userEvent);
  }
  clearLogs = () => {
    console.log('clearing logs');
    this.setState({ logs: this.createLogStore() });
  };
  start = () => {
    this.streaming = true;
    this.props.stream.on('data', this.streamListener);
  };
  stop = () => {
    this.streaming = false;
    this.props.stream.off('data', this.streamListener);
  };
  userEvent = e => {
    if (e.type === 'wheel') {
      const height = this.logContainer.offsetHeight;
      const diff = this.logContainer.scrollHeight - this.logContainer.scrollTop;

      if (diff - height <= 10) {
        this.setState({ autoScroll: true });
      } else {
        this.setState({ autoScroll: false });
      }
    }
  };

  streamListener = chunk => {
    const line = chunk.toString('utf8');
    this.queue.push({line, key: Math.random()});
    this.addLines();
  };

  addLines = throttle(
    () => {
      const logs = this.state.logs;
      logs.push(...this.queue);
      this.queue = [];
      this.setState({ logs });
      this.scrollToBottom();
    },
    250,
    { leading: false, trailing: true }
  );

  addLine = line => {
    const logs = this.state.logs;
    logs.push(line);
    this.setState({ logs });
    this.scrollToBottom();
  };

  scrollToBottom = throttle(
    () => {
      if (this.state.autoScroll) {
        this.bottom.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }
    },
    250,
    { trailing: true }
  );

  pause = () => {
    this.streaming ? this.stop() : this.start();
  };

  wrap = () => {
    this.setState({ wrap: !this.state.wrap });
  };

  render() {
    return (
      <div className="main">
        <div className="main-content">
          <div className="main-toolbar">
            <div>
              <Button size="small" onClick={this.pause}>
                Pause
              </Button>
              <Button size="small" onClick={this.wrap}>
                Wrap
              </Button>
              <Button size="small" onClick={this.clearLogs}>
                Clear
              </Button>
            </div>
            <div>AutoScroll: {this.state.autoScroll + ''}</div>
          </div>
          <div className="main-logs" ref={el => (this.logContainer = el)}>
            <LogPanel logs={this.state.logs} wrap={this.state.wrap} />
            <div
              ref={el => (this.bottom = el)}
              style={{ height: '20px', width: '100%' }}
            />
          </div>
        </div>
      </div>
    );
  }
}
