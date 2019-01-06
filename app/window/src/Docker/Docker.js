const _ = require('lodash');
const Dockerode = require('dockerode');

class DockerLogs {
  current = {};
  constructor() {
    this.docker = new Dockerode({
      Promise: require('bluebird')
    });
  }

  getContainers = async () => {
    let list = [];
    try {
      list = await this.docker.listContainers();
      list.sort((a, b) => {
        if (a.Names[0] < b.Names[0]) {
          return -1;
        }
        if (a.Names[0] > b.Names[0]) {
          return 1;
        }

        return 0;
      });
    } catch (err) {
      console.log(err);
    }

    return list;
  };

  getContainer = async name => {
    const containers = await this.docker.listContainers();
    const meta = containers.find(c => c.Names.includes(`/${name}`));
    if (!meta) {
      return;
    }
    const container = this.docker.getContainer(meta.Id);
    return {
      meta,
      obj: container
    };
  };

  stopExisting() {
    if (this.current && this.current.stream) {
      this.current.stream.destroy();
    }
  }

  follow = async (name, agStream) => {
    this.stopExisting();

    if (!name) {
      console.log('Cannot follow logs; name not provided');
      return;
    }
    const container = await this.getContainer(name);

    if (!container) {
      console.log(`Container not found: ${name}`);
      return;
    }
    if (!container.obj) {
      console.log('no Obj');
      return;
    }
    const opts = {
      follow: true,
      stdout: true,
      stderr: true,
      tail: 100
    };

    const stream = await container.obj.logs(opts);
    container.obj.modem.demuxStream(stream, agStream, agStream);

    stream.on('end', function() {
      console.log(`Container disconnected: ${container.meta.Names[0]}`);
    });

    this.current = { name, stream };

    return stream;
  };
}

export const Docker = new DockerLogs();
