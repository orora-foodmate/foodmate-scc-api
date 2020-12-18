const express = require("express");
const mongoose = require("mongoose");
const isEmpty = require("lodash/isEmpty");
const isNull = require("lodash/isNull");
const { getConditionByQuery } = require('../helpers/utils');
const { startOfDay, now, formatDateTime } = require("../helpers/dateHelper");
const { messageModel, friendModel, eventModel } = require("../models");

const router = express.Router();

const findRoom = async (roomId) => {
  const [friendRoom = null, eventRoom = null] = await Promise.all([
    friendModel.findOne({ room: roomId }),
    eventModel.findOne({ room: roomId })
  ]);

  if(isNull(friendRoom) && isNull(eventRoom)) return null;
  return isNull(friendRoom) ? eventRoom: friendRoom;
}
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user } = req;

    const room = await findRoom(roomId);
    if (isNull(room)) {
      throw new Error("房間不存在")
    }

    const userInfo = room.users.find(u => u.info.toString() === user.id.toString());

    if(isEmpty(userInfo) || userInfo.status !== 1) {
      throw new Error("只有房間成員才能查詢訊息");
    }

    const condition = getConditionByQuery(req.query);
    const messages = await messageModel.find({
      messages: {
        $elemMatch: {
          ...condition
        }
      }
    })
      .populate({ path: "messages.user", select: "account name" })
      .exec();
    res.status(200).json({
      success: true,
      data: {
        messages
      }
    })
  } catch (error) {
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
    const { user, body } = req;

    const room = await friendModel.findOne({ room: roomId });
    if (isEmpty(room)) {
      throw new Error("房間不存在")
    }
    if (!room.users.includes(user.id)) {
      throw new Error("只有房間成員才能發送訊息");
    }

    const id = new mongoose.Types.ObjectId();
    const date = startOfDay();
    const createAt = now();
    const newMessage = {
      _id: id,
      user: user.id,
      createAt,
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
    const responseData = {
      ...newMessage,
      _id: undefined,
      id: newMessage._id,
      createAt: formatDateTime(createAt),
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
    };

    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    req.exchange.transmitPublish(`room.newMessage.${roomId}`, responseData);

    return res.status(200).json({
      success: true,
      data: responseData,
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
