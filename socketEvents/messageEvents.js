const mongoose = require('mongoose');
const { messageModel, roomModel } = require("../models");
const { startOfDay } = require("../helpers/dateHelper");

const addNewMessageListener = async(socket) => {

}

const getMessagesListener = async (socket) => {
  // Set up a loop to handle and respond to RPCs.
  for await (let request of socket.procedure('getMessages')) {
    const { roomId, createAt } = request.data;
    const date = startOfDay(new Date(startDateTime));

    try {
      const room = await roomModel.findById(roomId);
      if (isEmpty(room)) {
        throw new Error("房間不存在")
      }
      if (!room.users.includes(user.id)) {
        throw new Error("只有房間成員才能查詢訊息");
      }

      const condition = getConditionByQuery({ createAt });
      const messages = await messageModel.find({
        messages: {
          $elemMatch: {
            ...condition
          }
        }
      });
      request.end(messages)
    } catch (error) {
      request.error(error)
    }
  }
}

module.exports.getMessagesListener = getMessagesListener;
