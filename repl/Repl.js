const pty = require('node-pty');
const COMMANDS = require('./LangCommands.js');

const Repl = {
  new(language) {
    return Object.create(this.init(language));
  },

  init(language) {
    const command = COMMANDS[language];
    if (command) {
      this.process = pty.spawn(command);
      this.language = language;
      console.log(`INITIALIZED ${command}`);
      return this;
    } 
    return null;
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
