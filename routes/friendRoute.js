const express = require('express');
const { friendModel } = require('../models');
const isEmpty = require('lodash/isEmpty');
const router = express.Router();

router.post('/reject/:friendId', async (req, res) => {
  const { friendId } = req.params;
  const creator = req.user._id;
  const users = [friendId, creator];

  try {
    const oldRecord = await friendModel.findOne({ users, creator });
    if (isEmpty(oldRecord) || oldRecord.status !== 1) {
      return res.status(500).json({ success: false, data: { message: '狀態錯誤' } });
    }

    oldRecord.status = 0;
    const result = await oldRecord.save();
    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message}
    });
  }
});

router.post('/invite/:friendId', async (req, res) => {
  const { friendId } = req.params;
  const creator = req.user._id;
  const users = [friendId, creator];

  const oldRecord = await friendModel.findOne({ users, creator });

  if (isEmpty(oldRecord)) {
    const friend = await friendModel.insert({
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
