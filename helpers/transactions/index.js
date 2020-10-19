const isEmpty = require('lodash/isEmpty');
const { friendModel } = require('../../models');

const approveFriendTransaction = async (userId, friendId) => {
  try {
    const friendRecord = await friendModel.findOne({ _id: friendId });
    const creatorId = friendRecord.creator.toString();
    if(isEmpty(friendRecord)) {
      throw new Error('不存在');
    }

    if(userId === creatorId) {
      throw new Error('建立者不能同意關係');
    }

    if(friendRecord.status !== 1) {
      throw new Error('狀態錯誤');
    }
    friendRecord.status = 2;
    await friendRecord.save();

    return {
      friend: friendRecord,
    };
  } catch (error) {
    throw error;
  }
}

module.exports.approveFriendTransaction = approveFriendTransaction;
