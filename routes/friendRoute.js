const express = require('express');
const { friendModel } = require('../models');
const isEmpty = require('lodash/isEmpty');
const isNull = require('lodash/isNull');
const { approveFriendTransaction } = require('../helpers/transactions');
const router = express.Router();

const getConditionByQuery = (query) => {
  let createAtConn = {};
  let updateAtConn = {};
  const { createAt = null, updateAt = null, or = null } = query;
  const hasOR = Boolean(or) && !isNull(createAt) && !isNull(updateAt);

  if (isNull(createAt) && isNull(updateAt)) {
    return {}
  }

  if (!isNull(createAt)) {
    createAtConn = { createAt: { $gte: decodeURI(createAt) } };
  }
  if (!isNull(updateAt)) {
    createAtConn = { updateAt: { $gte: decodeURI(updateAt) } };
  }
  return hasOR
    ? { $or: [createAtConn, updateAtConn] }
    : { ...createAtConn, ...updateAtConn };
}

router.get('/', async (req, res) => {
  try {
    const condition = getConditionByQuery(req.query);
    const { user } = req;
    const friends = await friendModel
      .find({ users: { $in: [user._id] }, ...condition })
      .populate({ path: "users", select: "account name" })
      .populate({ path: "creator", select: "account name" })
      .exec();

  return res.status(200).json({
    success: true,
    data: { friends },
  });
  } catch (error) {

    return res.status(200).json({
      success: true,
      data: { message: error.message },
    });
  }


});

router.post('/approve/:friendId', async (req, res) => {
  const { user } = req;
  const { friendId } = req.params;
  try {
    const result = await approveFriendTransaction(user._id, friendId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message }
    });
  }
});

router.post('/reject/:friendId', async (req, res) => {
  const { friendId } = req.params;
  try {
    const oldRecord = await friendModel.findById(friendId);
    if (isEmpty(oldRecord) || oldRecord.status !== 1) {
      return res.status(500).json({ success: false, data: { message: '狀態錯誤' } });
    }

    oldRecord.status = 0;
    const result = await oldRecord.save();

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message }
    });
  }
});

router.post('/invite/:userId', async (req, res) => {
  const { userId } = req.params;
  const creator = req.user._id;
  const users = [userId, creator];

  const oldRecord = await friendModel.findOne({ users });

  if (isEmpty(oldRecord)) {
    const friend = await friendModel.create({
      users,
      creator,
      status: 1
    });

    return res.status(200).json({
      success: true,
      data: friend
    });
  }

  if (oldRecord.status === 0) {
    oldRecord.status = 1;
    const result = await oldRecord.save();

    return res.status(200).json({
      success: true,
      data: result
    });
  }

  return res.status(500).json({
    success: false,
    data: { message: '狀態錯誤' }
  });
});

module.exports = router;
