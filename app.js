const Express = require('express');
const httpModule = require('http');
const socketIO = require('socket.io');
const _ = require('lodash');
const randomstring = require("randomstring");
const {
  initialSocketIO,
  createRoomListener,
  leaveRoomListener,
  localMessageListener,
  globalMessageListener,
} = require('./src/helpers/socketManager');

const app = Express();
const http = httpModule.Server(app);

const roomRouter = require('./src/routes/roomRouter');
app.use('/rooms', roomRouter);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

initialSocketIO(http).then(({ io, socket }) => {
  createRoomListener(socket);
  leaveRoomListener(socket);
  localMessageListener(socket, io);
  globalMessageListener(socket);
}).catch(error => { console.log('error: ', error) })

const {PORT = 3000} = process.env;

http.listen(PORT, function () {
  console.log(`listening on *:${PORT}`);
});

//Nodejs 奇怪的錯誤防止Process 死掉
process.on('uncaughtException', function (err) {
  console.log(err);
})