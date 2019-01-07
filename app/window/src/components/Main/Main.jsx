import React from 'react';
import { throttle } from 'lodash';
import { Button, Checkbox } from 'semantic-ui-react';
import { LogPanel } from '../LogPanel/LogPanel';

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
  }
  createLogStore = () => {
    const store = new Array();
    store.name = 'Log Store';
    return store;
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.container !== nextProps.container) {
      this.clearLogs();
    }
  }
  componentWillUnmount() {
    this.stop();
  }

  clearLogs = () => {
    this.setState({ logs: this.createLogStore() });
  }
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
    this.queue.push({ line, key: Math.random() });
    this.addLines();
  };

  addLines = throttle(
    () => {
      const logs = this.state.logs;
      logs.push(...this.queue);
      this.queue = [];
      this.setState({ logs, scrollToRow: logs.length - 1 });
      // this.scrollToBottom();
    },
    250,
    { leading: false, trailing: true }
  );

  setFollow = shouldFollow => {
    this.setState({ autoScroll: shouldFollow });
  };

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
            {/* <div>
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
            <div><Checkbox checked={this.state.autoScroll} label="Follow"/></div> */}
          </div>
          <div className="main-logs" ref={el => (this.logContainer = el)}>
            <LogPanel
              logs={this.state.logs}
              wrap={this.state.wrap}
              scrollToRow={this.state.scrollToRow}
              setFollow={this.setFollow}
            />
          </div>
        </div>
      </div>
    );
  }
}
