const isNull = require("lodash/isNull");
const { userModel, friendModel } = require("../models");

const getFriendFormat = (friend, user) => {
  const [status, creator, friendId] = isNull(friend)
    ? [0, null, null]
    : [friend.status, friend.creator, friend.id];

  return { ...user.toJSON(), friendId, status, friendCreator: creator };
};

const getUserByUserIds = async (authUserId, targetUserId) => {
  const [user, friend = null] = await Promise.all([
    userModel.findById(targetUserId, {
      password: false,
      hashPassword: false,
      regId: false,
    }),
    friendModel.findFriendByUsers(targetUserId, authUserId),
  ]);

  return getFriendFormat(friend, user);
};

const getUserByUserAccount = async (authUserId, targetUserAccount) => {
  const [user] = await userModel.find(
    { account: targetUserAccount },
    { password: false, hashPassword: false, regId: false }
  );

  const friend = await friendModel.findFriendByUsers(user.id, authUserId);

  return getFriendFormat(friend, user);
};

module.exports.getUserByUserIds = getUserByUserIds;
module.exports.getUserByUserAccount = getUserByUserAccount;
