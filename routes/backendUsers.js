const express = require('express');
const yup = require('yup');
const isEmpty = require('lodash/isEmpty');
const { responseOk, responseErrWithMsg } = require('../helpers/response');
const { saltHashPassword } = require('../helpers/utils');
const {
  createBackendUser,
  getBackendUserByName
} = require('../models/backendUserQueries');

const router = express.Router();
const DEFAULT_PASSWORD = 'a1234567';
const DEFAULT_PASSWORD_HASH = saltHashPassword(DEFAULT_PASSWORD);

const createBackendUserRequest = yup.object().shape({
  employee: yup.string().required('employee 不可為空'),
  actid: yup.number().required('actid 不可為空')
});

router.post('/', async (req, res) => {
  try {
    await createBackendUserRequest.validate(req.body);

    const userResult = await getBackendUserByName(req.body.employee);

    if(!isEmpty(userResult)) return responseErrWithMsg(res, '使用者已存在');
    
    const backendUserData = {
      ...req.body,
      stat: 1,
      optor: req.user.id,
      password: DEFAULT_PASSWORD_HASH
    };

    const result = await createBackendUser(backendUserData);

    return result.constructor.name === 'OkPacket'
      ? responseOk(res, {
          success: true,
          data: { backend_user_id: result.insertId }
        })
      : responseErrWithMsg(res, '建立後台使用者失敗');
  } catch (error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
