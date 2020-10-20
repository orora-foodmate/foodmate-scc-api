const express = require("express");
const { friendModel } = require("../models");
const isEmpty = require("lodash/isEmpty");
const pick = require("lodash/pick");
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

    const result = friends.map(item => item.toFriend());

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
  try {
    const result = await approveFriendTransaction(user._id, friendId);
    return res.status(200).json({
      success: true,
      data: result.toFriend(),
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

    return res.status(200).json({
      success: true,
      data: result.toFriend(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message },
    });
  }
});

router.post("/invite/:userId", async (req, res) => {
  const { userId } = req.params;
  const creatorString = req.user._id.toString();

  if (creatorString === userId) {
    return res.status(500).json({
      success: false,
      data: { message: "邀請者與被邀請者不可相同" },
    });
  }

  const users = [userId, creatorString];
  const oldRecord = await friendModel.findFriend({ users });

  if (isEmpty(oldRecord)) {
    const { id } = await friendModel.create({
      users,
      creator: creatorString,
      status: 1,
    });

    const friend = await friendModel.findFriend({ _id: id });
    return res.status(200).json({
      success: true,
      data: friend.toFriend(),
    });
  }

  if (oldRecord.status === 0) {
    oldRecord.status = 1;
    oldRecord.creator = creatorString;
    const result = await oldRecord.save();

    return res.status(200).json({
      success: true,
      data: result.toFriend(),
    });
  }

  return res.status(500).json({
    success: false,
    data: { message: "狀態錯誤" },
  });
});

module.exports = router;
