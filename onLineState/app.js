const { User } = require('./models');
const isNull = require('lodash/isNull');

const createNewUserStatus = (userId) => {
  const user = new User({
    id: userId,
  });
  user.save();
};

const activeUserStatus = (userId, socketId) => {
  User.findOne({ where: { id: userId } }, (error, user) => {
    user.socketId = socketId;
    user.active = true;
    user.save();
  });
}

const unActiveUserStatus = (userId) => {
  User.findOne({ where: { id: userId } }, (error, user) => {
    user.socketId = '';
    user.active = false;
    user.save();
  });
}

// 未來要拆出 microservice 時使用
const createNewUserListener = async (socket) => {
  // Set up a loop to handle and respond to RPCs.
  for await (let request of socket.procedure('createNewUserStatus')) {
    const { userId = null } = request.data;

    try {
      if (isNull(userId)) {
        throw new Error("userId is null");
      }
      createNewUserStatus(userId);

      request.end(user)
    } catch (error) {
      console.log('forawait -> error', error)
      request.error(error)
    }
  }
}

module.exports.createNewUserListener = createNewUserListener;
module.exports.createNewUserStatus = createNewUserStatus;
module.exports.activeUserStatus = activeUserStatus;
module.exports.unActiveUserStatus = unActiveUserStatus;
