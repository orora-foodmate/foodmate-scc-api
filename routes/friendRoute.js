const express = require("express");
const { friendModel } = require("../models");
const isEmpty = require("lodash/isEmpty");
const { approveFriendTransaction } = require("../helpers/transactions");
const { getConditionByQuery } = require("../helpers/utils");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { user } = req;
    const condition = getConditionByQuery(req.query);
    const friends = await friendModel.findFriends({
      status: { $ne: 0 },
      users: { $in: [user._id] },
      ...condition,
    });

    const result = friends.map(item => item.toFriend(user._id.toString()));

    return res.status(200).json({
      success: true,
      data: { friends: result },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

router.post("/approve/:friendId", async (req, res) => {
  const { user } = req;
  const { friendId } = req.params;
  const authUserId = user._id.toString();

  try {
    const friendResult = await approveFriendTransaction(user._id, friendId);

    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    const targetUser= friendResult.users.find(u => u.id.toString() !== authUserId);
    const userId = targetUser.id.toString();
    req.exchange.transmitPublish(`friend.approveFriend.${userId}`, friendResult.toFriend(userId));

    return res.status(200).json({
      success: true,
      data: friendResult.toFriend(authUserId),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

router.post("/reject/:friendId", async (req, res) => {
  const { friendId } = req.params;
  try {
    const oldRecord = await friendModel.findFriendById(friendId);

    if (isEmpty(oldRecord) || oldRecord.status !== 1) {
      throw new Error("狀態錯誤");
    }

    oldRecord.status = 0;
    const result = await oldRecord.save();

    
    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    const targetUser= oldRecord.users.find(u => u.id.toString() !== req.user._id.toString());
    const userId = targetUser.id.toString();
    req.exchange.transmitPublish(`friend.rejectFriend.${userId}`, oldRecord.toFriend(userId));

    return res.status(200).json({
      success: true,
      data: result.toFriend(req.user._id.toString()),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

router.post("/invite/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const creatorString = req.user._id.toString();

    if (creatorString === userId) {
      throw new Error("邀請者與被邀請者不可相同")
    }

    const users = [userId, creatorString];
    const oldRecord = await friendModel.findFriendByUsers(userId, creatorString);

    if (isEmpty(oldRecord)) {
      await friendModel.create({
        users,
        creator: creatorString,
        status: 1,
      });
    } else {
      if (oldRecord.status === 0) {
        oldRecord.status = 1;
        oldRecord.creator = creatorString;
        await oldRecord.save();
      } else {
        throw new Error('狀態錯誤');
      }
    }

    const friend = await friendModel.findFriendByUsers(userId, creatorString);

    // Todo: 如果未來ws 拆出去要透過 exchange 溝通 services
    req.exchange.transmitPublish(`friend.inviteFriend.${userId}`, friend.toFriend(userId));

    return res.status(200).json({
      success: true,
      data: friend.toFriend(creatorString),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

module.exports = router;
