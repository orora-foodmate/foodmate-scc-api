const crypto = require('crypto');

const {SALT_SECRET} = process.env;

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
