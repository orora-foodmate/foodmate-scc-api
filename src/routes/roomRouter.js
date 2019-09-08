const express = require('express');
const router = express.Router();
const { responseOk } = require('../helpers/response');

router.get('/', async (_, res) => {
  responseOk(res, {success: true});
});

module.exports = router;