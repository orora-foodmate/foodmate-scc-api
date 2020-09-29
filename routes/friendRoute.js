const express = require('express');
const { friendModel } = require('../models');
const isEmpty = require('lodash/isEmpty');
const router = express.Router();

router.post('/invite/:friendId', async (req, res) => {
  console.log('req.user', req.user)
  const { friendId } = req.params;
  const users = [friendId, req.user._id];
  const creator = req.user._id;

  const oldRecord = friendModel.findOne({ users, creator });

  if(!isEmpty(oldRecord) && oldRecord.status !== 0) {
    return res.status(500).json({ success: false, data: { message: '狀態錯誤' } });
  }

  const friend = new friendModel({
    users,
    creator: req.user._id,
    status: 0
  });

  friend.save(error => {
    console.log('error', error)
    if (!isEmpty(error)) {
      return res.status(500).json({ success: false, data: { message: error.message } });
    }

    return res.status(200).json({
      success: true,
      data: friend
    })
  })
});

module.exports = router;
