const crypto = require('crypto');
const isNull = require('lodash/isNull');

const {SALT_SECRET} = process.env;

const getConditionByQuery = (query) => {
  let createAtConn = {};
  let updateAtConn = {};
  const { createAt = null, updateAt = null, or = null } = query;
  const hasOR = Boolean(or) && !isNull(createAt) && !isNull(updateAt);

  if (isNull(createAt) && isNull(updateAt)) {
    return {}
  }

  if (!isNull(createAt)) {
    createAtConn = { createAt: { $gt: decodeURI(createAt) } };
  }
  if (!isNull(updateAt)) {
    updateAtConn = { updateAt: { $gt: decodeURI(updateAt) } };
  }
  return hasOR
    ? { $or: [createAtConn, updateAtConn] }
    : { ...createAtConn, ...updateAtConn };
}

module.exports.getConditionByQuery = getConditionByQuery;
module.exports.debugLog = msg => console.log(`[debug] ${msg}`);

const sha512 = function(password, salt){
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return {
      salt:salt,
      passwordHash:value.toString()
  };
};

module.exports.saltHashPassword = (userpassword) => {
  const  passwordData = sha512(userpassword, SALT_SECRET);
  return passwordData.passwordHash;
}

