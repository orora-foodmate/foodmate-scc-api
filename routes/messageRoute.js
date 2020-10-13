const express = require("express");
const mongoose = require("mongoose");
const isEmpty = require("lodash/isEmpty");
const isNull = require("lodash/isNull");
const pick = require("lodash/pick");
const { startOfDay, zonedTimeToUtc } = require("../helpers/dateHelper");
const { roomModel, messageModel } = require("../models");
const router = express.Router();

const getDateTimeRange = (query) => {

}
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user } = req;

    const room = await roomModel.findById(roomId);
    if (isEmpty(room)) {
      throw new Error("房間不存在")
    }
    if (!room.users.includes(user._id)) {
      throw new Error("只有房間成員才能查詢訊息");
    }

    const messages = await messageModel.findOne({
      messages: {
        $elemMatch: {
          createAt: {
            $gt: zonedTimeToUtc(new Date('2020-10-12 00:00:00'))
          }
        }
      }
    }).exec();
    res.status(200).json({
      success: true,
      data: {
        messages
      }
    })
  } catch(error) {
    console.log('error', error)
    res.status(500).json({
      success: false,
      data: {
        message: error.message,
      },
    });
  }
});

router.post("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user, body } = req;11

    const room = await roomModel.findById(roomId);
    if (isEmpty(room)) {
      throw new Error("房間不存在")
    }
    if (!room.users.includes(user._id)) {
      throw new Error("只有房間成員才能發送訊息");
    }

    const id = mongoose.Types.ObjectId();
    const date = startOfDay();
    const newMessage = {
      _id: id,
      user: user._id,
      ...body,
    };
    console.log('newMessage', newMessage)

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
