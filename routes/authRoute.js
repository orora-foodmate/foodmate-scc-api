const express = require('express');
const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const { saltHashPassword } = require("../helpers/utils");
const { userModel } = require('../models');
const { agServer } = require("../helpers/agServerCreator");
const router = express.Router();
const yup = require('yup');

const loginSchema = yup.object().shape({
  account: yup.string().required("account 不可為空"),
  password: yup.string().required("password 不可為空"),
  regId: yup.string().required("regId 不可為空"),
});

router.post('/login', async (req, res) => {
  try {
    console.log('req.body', req.body)
    await loginSchema.validate(req.body);
    const { account, password, regId } = req.body;
    const user = await userModel.findOne({ account });

    if (isEmpty(user)) {
      return res.status(400).json({
        success: false,
        data: {
          message: '使用者不存在'
        }
      })
    }

    const hashPassword = saltHashPassword(password, process.env.SALT_SECRET);

    if (user.hashPassword !== hashPassword) {
      return res.status(401).json({
        success: false,
        data: {
          message: "authorization fail",
        },
      });
    }

    user.regId = regId;
    await user.save();

    const myTokenData = pick(user, ["_id", "account", "avatar", "name"]);
    const signedTokenString = await agServer.auth.signToken(
      myTokenData,
      agServer.signatureKey
    );

    res.status(200).json({
      success: true,
      data: {
        ...myTokenData,
        token: signedTokenString,
      },
    });
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ success: false, data: { message: error.message } })
  }
});

module.exports = router;
