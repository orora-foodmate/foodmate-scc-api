const mongoose = require('mongoose');
const { messageModel } = require("../models");
const { startOfDay } = require("date-fns");

const getMessagesLisenter = async (socket) => {
  // Set up a loop to handle and respond to RPCs.
  for await (let request of socket.procedure('getRooms')) {
    const {roomId, startDateTime} = request.data;
    console.log("forawait -> startDateTime", startDateTime)
    const date = startOfDay(new Date(startDateTime));

    try {
      console.log("forawait -> new Date(startDateTime)", new Date(startDateTime))
      const messages = await messageModel.find({
        room: mongoose.Types.ObjectId(roomId),
        date: {"$gte": date},
        "messages.createAt": {
          "$gte": new Date(startDateTime)
        }
      });
      request.end(messages)
    } catch (error) {
      request.error(error)
    }
  }
}

module.exports.getMessagesLisenter = getMessagesLisenter;
