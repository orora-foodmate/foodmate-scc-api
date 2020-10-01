const mongoose = require('mongoose');
const { roomModel } = require("../models");
const isNull = require("lodash/isNull");

const getRoomsLisenter = async (socket) => {
  console.log("getRoomsLisenter -> socket.authToken", socket.authToken)
  // Set up a loop to handle and respond to RPCs.
  for await (let request of socket.procedure('getRooms')) {
    const {_id: userId} = socket.authToken;
    const {updateAt = null} = request.data;
    // const {roomId, startDateTime} = request.data;
    // const date = startOfDay(new Date(startDateTime));

    try {
      const queryPayload = {
        "users": {
          "$in": mongoose.Types.ObjectId(userId)
        },
      };

      if(!isNull(updateAt)) {
        queryPayload.updateAt = {
          "$gte": new Date(updateAt)
        };
      };

      const rooms = await roomModel.find(queryPayload);
      request.end(rooms)
    } catch (error) {
      request.error(error)
    }
  }
}

module.exports.getRoomsLisenter = getRoomsLisenter;
