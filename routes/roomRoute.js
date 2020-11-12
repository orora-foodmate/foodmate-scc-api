const express = require('express');
const { getConditionByQuery } = require('../helpers/utils');
const { roomModel } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const condition = getConditionByQuery(req.query);
    const { user } = req;
    const rooms = await roomModel
      .find({ users: { $in: [user.id] }, ...condition })
      .populate({ path: "users", select: "account name avatar" })
      .populate({ path: "creator", select: "account name avatar" })
      .exec();

    return res.status(200).json({
      success: true,
      data: { rooms }
    })
  } catch(error) {
    return res.status(500).json({
      success: false,
      data: { message: error.message }
    })
  }
});
module.exports = router;
