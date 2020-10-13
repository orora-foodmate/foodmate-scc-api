const express = require("express");
const mongoose = require("mongoose");
const isEmpty = require("lodash/isEmpty");
const pick = require("lodash/pick");
const { startOfDay } = require("date-fns");
const { roomModel, messageModel } = require("../models");
const router = express.Router();

router.post("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user, body } = req;

    const room = await roomModel.findById(roomId);
    if (isEmpty(room)) {
      throw new Error("房間不存在")
    }
    if (!room.users.includes(user._id)) {
      throw new Error("只有房間成員才能發送訊息");
    }

    const id = mongoose.Types.ObjectId();
    const date = startOfDay(Date.now());
    const newMessage = {
      _id: id,
      user: user._id,
      ...body,
    };

    const messageResult = await messageModel.findOne({
      room: roomId,
      date,
    });

    if (isEmpty(messageResult)) {
      const rowData = {
        room: roomId,
        date,
        messages: [newMessage],
      };
      await messageModel.create(rowData);
    } else {

      messageResult.messages.push(newMessage);
      await messageResult.save();
    }

    return res.status(200).json({
      success: true,
      data: { ...newMessage, user: pick(user, ['_id', 'name', 'avatar']) },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        message: error.message,
      },
    });
  }
});

module.exports = router;
