const pty = require('node-pty');

const Repl = {
  new(command) {
    return Object.create(this.init(command));
  },

  init(command) {
    this.process = pty.spawn(command);
    return this;
  },

  on(event, callback) {
    this.process.on(event, callback);
  },

  write(string) {
    return new Promise((resolve, reject) => {
      let result = '';
      let concatResult = data => result += data;

      this.process.write(string + "\n");

      this.process.on('data', concatResult);

      setTimeout(() => {
        resolve(result);
        this.process.removeListener('data', concatResult);
      }, 10);
      // wait for output to buffer
    });

  },

  kill() {
    this.process.kill();
  },

  id() {
    return this.process.pid;
  }
};

module.exports = Repl;
