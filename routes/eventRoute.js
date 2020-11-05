const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {
  try {
    const { user } = req;

    return res.status(200).json({
      success: true,
      data: {  },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      data: { message: error.message },
    });
  }
});

module.exports = router;
