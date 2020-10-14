const caminte = require('caminte');
const { now } = require('../../helpers/dateHelper');
const Schema = caminte.Schema;
const redisSchema = new Schema('redis', { port: 6379 });

const User = redisSchema.define('users', {
  id: {type: redisSchema.String, unique: true, index: true, require: true },
  socketId: {type: redisSchema.String, index: true, default: null },
  createAt: { type: redisSchema.Date, default: now},
  updateAt: { type: redisSchema.Date, default: now},
  active: { type: redisSchema.Boolean, default: false },
});

User.afterUpdate = function (next) {
  this.updateAt = now();
  this.save();
  next();
};

// const user = new User({ 
//   id:       'userId',
// });

// user.save();
// console.log('user', user)

module.exports.User = User;