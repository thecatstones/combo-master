const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const Repl = require('./repl/Repl.js');
const languages_commands = require('./repl/languages_commands.js');

const port = process.env.port || 3000;

const app = express();
app.use(bodyParser.text());
app.use(express.static('public'));

app.get('/:room', (req, res) => {
  if (req.params.room === 'favicon.ico') return;
  res.sendFile(path.join(__dirname, './index.html'));
});

const server = http.Server(app);
server.listen(port, () => console.log(`Listening on ${port}...`));

const io = socketIo(server);

let repl = null;

io.on('connection', (socket) => {
  socket.on('execRepl', ({ language = 'ruby' } = {}) => {
    console.log(language);
    repl = Repl.new(languages_commands[language]);
  });

  socket.on('execute', ({ line }) => {
    repl.write(`${line}\r\n`)
      .then(data => {
        io.emit('output', { output: data });
      });
  });
});
