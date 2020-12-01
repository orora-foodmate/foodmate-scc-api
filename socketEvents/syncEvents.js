const mongoose = require('mongoose');
const { getConditionByQuery } = require('../helpers/utils');
const { eventModel, friendModel } = require('../models');

const syncDataListener = async (socket) => {
  for await (let request of socket.procedure('syncData')) {
    const { id: userId } = socket.authToken;
    
    try {
      const {
        eventMaxCreateAt,
        eventMaxUpdateAt,
        friendMaxCreateAt,
        friendMaxUpdateAt,
      } = request.data;
      const events = await eventModel.findEvents({
        // "users.info": { $in: [userId] },
        ...getConditionByQuery({createAt: eventMaxCreateAt, updateAt: eventMaxUpdateAt, or: true})
      });

      const friends = await friendModel.findFriends({
        status: { $ne: 0 },
        users: { $in: [userId] },
        ...getConditionByQuery({createAt: friendMaxCreateAt, updateAt: friendMaxUpdateAt, or: true})
      });
      return request.end({
        events,
        friends: friends.map(item => {
          return {
            ...item.toFriend(userId.toString()),
            regId: undefined,
            creator: undefined,
          };
        }),
      })
    } catch (error) {
      return request.error(error)
    }
  }
}

module.exports.syncDataListener = syncDataListener;
