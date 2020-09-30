const express = require('express');
const { userModel } = require('../models');
const router = express.Router();
const tokenVerifyMiddleware = require('../helpers/tokenVerify');

router.get('/:id', tokenVerifyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id, {password: -1, hashPassword: -1});
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch(error) {
    return res.status(200).json({
      success: true,
      data: null
    });
  }
  
});

router.post('/', async (req, res, next) => {
  try {
    const { name, password, account } = req.body;
    const user = new userModel({
      name,
      password,
      account
    });
    user.save((error) => {
      if (error) {
        return res.status(500).json({ success: false, data: { message: error.message } });
      }

      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          account: user.account
        }
      });
    })
  } catch (error) {
    next(error);
  }
});

module.exports = router;
