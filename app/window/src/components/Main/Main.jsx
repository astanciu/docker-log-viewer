import React from 'react';
import { throttle } from 'lodash';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { LogPanel } from '../LogPanel/LogPanel';

export class Main extends React.Component {
  test = 1;
  streaming = true;
  queue = [];
  state = {
    logs: [],
    wrap: false,
    follow: true
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
  };
  start = () => {
    this.streaming = true;
    this.props.stream.on('data', this.streamListener);
  };
  stop = () => {
    this.streaming = false;
    this.props.stream.off('data', this.streamListener);
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
      // this.setState({ logs });
      const state = { logs };
      if (this.state.follow) {
        state.scrollToRow = logs.length - 1;
      }
      this.setState(state);
    },
    250,
    { leading: false, trailing: true }
  );

  setFollow = shouldFollow => {
    this.setState({ follow: shouldFollow });
  };

  pause = () => {
    this.streaming ? this.stop() : this.start();
  };

  wrap = () => {
    this.setState({ wrap: !this.state.wrap });
  };

  test = () => {
    this.setState({ scrollToRow: this.state.logs.length - 1 });
    console.log('fuck - ', this.state.logs.length - 1);
  };

  toggleFollow = (e, data) => {
    this.setState({ follow: !this.state.follow });
  };

  render() {
    return (
      <div className="main">
        <div className="main-content">
          <div className="main-toolbar">
            <div>
              <Button basic inverted size="mini" onClick={this.pause}>
                Pause
              </Button>
              <Button basic inverted size="mini" onClick={this.wrap}>
                Wrap
              </Button>
              <Button basic inverted size="mini" onClick={this.clearLogs}>
                Clear
              </Button>
              <Button basic inverted size="mini" onClick={this.test}>
                test
              </Button>
            </div>
            <div>
              <Popup trigger={
              <Icon
                className="icon-button"
                circular
                inverted={this.state.follow}
                color="green"
                name="eye"
                onClick={this.toggleFollow}
              />} content='Follow (autoscroll)' />

              {/* <Button circular  icon='eye' size='tiny' toggle active={this.state.follow} onClick={this.onChangeFollow}/> */}
              {/* <Checkbox checked={this.state.follow} label="Follow" onChange={this.onCheckbox} /> */}
            </div>
          </div>
          <div className="main-logs" ref={el => (this.logContainer = el)}>
            <LogPanel
              logs={this.state.logs}
              wrap={this.state.wrap}
              follow={this.state.follow}
              setFollow={this.setFollow}
              scrollToRow={this.state.scrollToRow}
            />
          </div>
        </div>
      </div>
    );
  }
}
