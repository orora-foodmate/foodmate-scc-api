const { User } = require('./models');
const isNull = require('lodash/isNull');

const createNewUserStatus = (userId) => {
  const user = new User({
    id: userId,
  });
  user.save();
  return user;
};

const activeUserStatus = (userId, socketId) => {
  User.findOne({ where: { id: userId } }, (error, user) => {
    const localUser = isNull(user)
      ? createNewUserStatus(userId)
      : user;
    
    localUser.socketId = socketId;
    localUser.active = true;
    localUser.save();
  });
}

const unActiveUserStatus = (userId) => {
  User.findOne({ where: { id: userId } }, (error, user) => {
    const localUser = isNull(user)
      ? createNewUserStatus(userId)
      : user;
    
    localUser.socketId = null;
    localUser.active = false;
    localUser.save();
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
      request.error(error)
    }
  }
}

module.exports.createNewUserListener = createNewUserListener;
module.exports.createNewUserStatus = createNewUserStatus;
module.exports.activeUserStatus = activeUserStatus;
module.exports.unActiveUserStatus = unActiveUserStatus;
