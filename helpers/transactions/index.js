const isEmpty = require('lodash/isEmpty');
const { friendModel } = require('../../models');

const approveFriendTransaction = async (userId, friendId) => {
  const session = await friendModel.startSession();
  await session.startTransaction();
  try {
    const friendRecord = await friendModel.findOne({ _id: friendId }).session(session);
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

    await session.commitTransaction();

    return {
      friend: friendRecord,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports.approveFriendTransaction = approveFriendTransaction;
