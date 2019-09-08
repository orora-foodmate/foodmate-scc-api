const socketIO = require('socket.io');
const roomClass = require('./classes/roomClass');
const isEmpty = require('lodash/isEmpty');
const find = require('lodash/find');
const isUndefined = require('lodash/isUndefined');
const randomstring = require("randomstring");

let user_count = 0;
let io = null;
let rooms = [];


function DisconnectRoom(rooms, socket) {
  const roomId = socket.id;

  let targetRoom = find(rooms, (room) => {
    return room.id === roomId;
  });
  socket.leave(targetRoom.id);
}

function checkRoomId(rooms, roomId) {
  let checkReq = isUndefined(roomId) || isEmpty(roomId),
    resp = {
      error: null,
      success: false
    };
 
  let targetRoom = find(rooms, (room) => {
    return room.id === roomId;
  });

  if (checkReq) {
    resp.error = {
      status: 404,
      message: 'roomId 不可為空'
    };
  } else if (isUndefined(targetRoom)) {
    resp.error = {
      status: 404,
      message: '房間不存在'
    };
  } else {
    resp.success = true;
    resp.targetRoom = targetRoom;
  }

  return resp;
}

const initialSocketIO = (http) => {
  return new Promise((resolve) => {
    io = socketIO(http);
    io.on('connection', (socketObject) => {
      socketObject.emit('getuid', {
        uid: socketObject.id
      });
    
      resolve({io, socket: socketObject});
    });
  });
};

const createRoomListener = (socket) => {

  socket.on('createroom', (data) => {
    const roomID = randomstring.generate();
    const params = {
      id: roomID,
    };

    const room = new roomClass(params);
    rooms.push(room);
    socket.emit('success', {
      status: 200,
      roomId: room.id,
      message: `建立房間${room.id}成功`
    });
  });
}

const joinRoomListener = (socket) => {

  socket.on('joinroom', (req) => {
    const checkResult = checkRoomId(rooms, req.roomId);

    if (checkResult.error) {
      socket.emit('errorStatus', checkResult.error);
    } else {

      checkResult.targetRoom.addMember(socket)
        .then(() => {
          socket.join(req.roomId);

          socket.emit('success', {
            status: 200,
            message: `使用者${socket.id}已加入成功`
          });
        }).catch(error => {
          socket.emit('error', {
            status: 404,
            message: error.message
          });
        });
    }
  });
}

const leaveRoomListener = (socket) => {

  socket.on('leaveroom', (req) => {
    const checkResult = checkRoomId(rooms, req.roomId);

    if (checkResult.error) {
      socket.emit('errorStatus', checkResult.error);
    } else {
      checkResult.targetRoom.removeMember(socket);
      socket.leave(req.roomId);
      socket.emit('success', {
        status: 200,
        message: `${socket.id}已經離開房間`
      });
    }
  });
}

const localMessageListener = (socket, io) => {

  socket.on('localmessage', (req) => {
    const checkResult = checkRoomId(rooms, req.roomId);

    if (checkResult.error) {
      socket.emit('errorStatus', checkResult.error);
    } else {
      io.to(req.roomId).emit('localmessage', req.params);
    }
  });
}

const globalMessageListener = (socket) => {

  socket.on('globalmessage', (req) => {
    io.emit('globalmessage', req.params);
  });
}

const disconnectListener = (socket) => {

  socket.on('disconnect', function () {
    DisconnectRoom(rooms, socket.id);
    io.emit('user left', {
      username: socket.username
    });
  });
}

module.exports.initialSocketIO = initialSocketIO;
module.exports.createRoomListener = createRoomListener;
module.exports.joinRoomListener = joinRoomListener;
module.exports.leaveRoomListener = leaveRoomListener;
module.exports.localMessageListener = localMessageListener;
module.exports.globalMessageListener = globalMessageListener;