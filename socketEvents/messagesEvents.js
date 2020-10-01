const mongoose = require('mongoose');
const { messageModel } = require("../models");
const { startOfDay } = require("date-fns");

const getMessagesLisenter = async (socket) => {
  // Set up a loop to handle and respond to RPCs.
  for await (let request of socket.procedure('getRooms')) {
    console.log("forawait -> request.data", request.data)
    const {roomId, startDateTime} = request.data;
    console.log("forawait -> roomId", roomId)
    const date = startOfDay(new Date(startDateTime));

    try {
      const messages = await messageModel.find({
        room: mongoose.Types.ObjectId(roomId),
        date: {"$gte": date},
      });
      console.log("forawait -> messages", messages)
      request.end(messages)
    } catch (error) {
      console.log('forawait -> getRooms -> error.message', error.message)
      request.error(error)
    }
  }
}

module.exports.getMessagesLisenter = getMessagesLisenter;
