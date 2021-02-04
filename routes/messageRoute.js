const express = require("express");
const mongoose = require("mongoose");
const isEmpty = require("lodash/isEmpty");
const isNull = require("lodash/isNull");
const { getConditionByQuery } = require('../helpers/utils');
const { startOfDay, now, formatDateTime } = require("../helpers/dateHelper");
const { messageModel, friendModel, eventModel } = require("../models");

const router = express.Router();

const verifyIsFriend = (currentUser, room) => {
console.log("TCL ~ file: messageRoute.js ~ line 12 ~ verifyIsFriend ~ room", room)
  const userId = room.users.find(u => u.toString() === currentUser.id.toString());

  if (isEmpty(userId) || room.status !== 2) {
    throw new Error("只有朋友才能傳送信息");
  }
};

const verifyIsRoom = (currentUser, room) => {
  const userId = room.users.find(u => u.info.toString() === currentUser.id.toString());
  if (isEmpty(userId) || userId.status !== 1) {
    throw new Error("只有房間成員才能查詢訊息");
  }
}

const findRoom = async (roomId) => {
  const [friendRoom = null, eventRoom = null] = await Promise.all([
    friendModel.findOne({ room: roomId }),
    eventModel.findOne({ room: roomId })
  ]);

  if (isNull(friendRoom) && isNull(eventRoom)) return null;

  return isNull(friendRoom)
    ? { type: 'event', room: eventRoom }
    : { type: 'friend', room: friendRoom };
}
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { user } = req;

    const {type, room} = await findRoom(roomId);
    if (isNull(room)) {
      throw new Error("房間不存在")
    }

    type === 'friend'
      ? verifyIsFriend(user, room)
      : verifyIsRoom(user, room);

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

    const {type, room} = await findRoom(roomId);

    if (isEmpty(room)) {
      throw new Error("房間不存在")
    }

    type === 'friend'
      ? verifyIsFriend(user, room)
      : verifyIsRoom(user, room);

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
