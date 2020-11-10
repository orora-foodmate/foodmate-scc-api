const express = require('express');
const mongoose = require('mongoose');
const { userModel } = require('../models');
const pick = require("lodash/pick");
const router = express.Router();
const tokenVerifyMiddleware = require('../helpers/tokenVerify');
const { agServer } = require("../helpers/agServerCreator");
const { createNewUserStatus } = require('../onLineState/app');
const { getUserByUserIds } = require('../helpers/mongooseHelper');

router.get('/:id', tokenVerifyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserByUserIds(req.user._id.toString(), id);

    return res.status(200).json({
      success: true,
      data: { ...user, creator: undefined },
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

    const myTokenData = pick(user, ["_id", "account", "avatar", "name"]);
    const signedTokenString = await agServer.auth.signToken(
      myTokenData,
      agServer.signatureKey
    );
    return res.status(200).json({
      success: true,
      data: {
        ...myTokenData,
        token: signedTokenString,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: { message: error.message } });
  }
});

router.patch('/', tokenVerifyMiddleware, async (req, res, next) => {
  try {
    const { name, id } = req.body;
    const user = userModel.findById(id, { password: false, hashPassword: false })
    await user.update({ _id: id, name });

    return res.status(200).json({
      success: true,
      data: {
        id,
        name: user.name,
        account: user.account
      }
    });
  }catch(error) {
    return res.status(500).json({ success: false, data: { message: error.message } });
  }
})

module.exports = router;
