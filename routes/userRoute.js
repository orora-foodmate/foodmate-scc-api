const express = require('express');
const mongoose = require('mongoose');
const { userModel } = require('../models');
const router = express.Router();
const tokenVerifyMiddleware = require('../helpers/tokenVerify');
const { createNewUserStatus } = require('../onLineState/app');
const { getUserByUserIds } = require('../helpers/mongooseHelper');

router.get('/:id', tokenVerifyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = getUserByUserIds(req.user._id.toString(), id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      data: null
    });
  }

});

router.post('/', async (req, res) => {
  try {
    const { name, password, account } = req.body;
    const id = mongoose.Types.ObjectId();
    const user = new userModel({
      _id: id,
      name,
      password,
      account
    });
    await user.save();
    createNewUserStatus(id);
    // 之後要拆出 micro service 控制 online status 時使用
    // await req.exchange.invokePublish('createNewUserStatus', { userId: id });

    return res.status(200).json({
      success: true,
      data: {
        id,
        name: user.name,
        account: user.account
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: { message: error.message } });
  }
});

module.exports = router;
