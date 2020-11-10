const isNull = require('lodash/isNull');
const { userModel, friendModel } = require('../models');

const getUserByUserIds = async (authUserId, targetUserId) => {
  const [user, friend = null] = await Promise.all([
    userModel.findById(targetUserId, { password: false, hashPassword: false, regId: false }),
    friendModel.findFriendByUsers(targetUserId, authUserId)
  ]);

  const [status, creator, friendId] = isNull(friend)
    ? [0, null, null]
    : [friend.status, friend.creator, friend.id];

  return { ...user.toJSON(), friendId, status, friendCreator: creator };
};

module.exports.getUserByUserIds = getUserByUserIds;
