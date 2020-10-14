const caminte = require("caminte");
const { now } = require("../../helpers/dateHelper");
const Schema = caminte.Schema;
const redisSchema = new Schema("redis", { port: 6379 });

const TaskIndexes = redisSchema.define("taskIndexes", {
  id: { type: redisSchema.String, unique: true, index: true, require: true },
  sequence: { type: redisSchema.Number, default: 0 },
});


TaskIndexes.afterUpdate = function (next) {
  this.save();
  next();
};

const User = redisSchema.define("users", {
  id: { type: redisSchema.String, unique: true, index: true, require: true },
  socketId: { type: redisSchema.String, index: true, default: "" },
  createAt: { type: redisSchema.Date, default: now },
  updateAt: { type: redisSchema.Date, default: now },
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
module.exports.TaskIndexes = TaskIndexes;