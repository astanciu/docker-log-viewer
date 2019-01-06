import React from 'react';
import { Main } from './components/Main/Main';
import { SideBar } from './components/SideBar/SideBar';
import { TopBar } from './components/TopBar';
import { Docker } from './Docker/Docker';
const stream = require('stream');

class Application extends React.Component {
  state = {
    containers: [],
    stream
  };
  constructor() {
    super();
    this.logStream = new stream.PassThrough();
  }

  componentDidMount() {
    this.loadContainers();
    var intervalId = setInterval(this.loadContainers, 30 * 1000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  loadContainers = async () => {
    const containers = await Docker.getContainers();
    this.setState({ containers });
  };

  view = containerName => {
    this.setState({ container: containerName });
    Docker.follow(containerName, this.logStream);
  };

  render() {
    return (
      <div className="app">
        <TopBar />
        <div className="app-container">
          <SideBar containers={this.state.containers} view={this.view} />
          <Main stream={this.logStream} container={this.state.container} />
        </div>
      </div>
    );
  }
}

export default Application;
