const express = require('express');
const {userModel} = require('../models');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const {name, password, account } = req.body;
    console.log(1);
    const user = new userModel({
      name,
      password,
      account
    });
    console.log(2);
    user.save((error) => {
      console.log(3);
      if(error) {
        return res.status(500).json({success: false, data: { message: error.message}});
      }
      console.log(4);
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          account: user.account
        }
      })
    })
  } catch (error) {
    next(error);
  }
});

module.exports = router;
