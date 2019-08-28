const express = require('express');
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const pick = require('lodash/pick');
const { responseOk, responseErrWithMsg } = require('../helpers/response');

const router = express.Router();

const {AUTH_SECRET} = process.env;

router.get('/', (req, res, next) => {
  res.json({ title: 'Express' });
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', {session: true}, (err, user) => {
      if (err) return responseErrWithMsg(res, err.message);

      const signInfo = pick(user, ['id']);
      const token = jwt.sign(signInfo, AUTH_SECRET);

      return responseOk(res, {success: true, data: {token}});
  })(req, res);
});

module.exports = router;
