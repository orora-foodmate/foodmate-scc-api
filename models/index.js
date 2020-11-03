const mongoose = require('mongoose');

const {
  NODE_ENV,
  MONGO_URI,
  MONGO_PORT,
  MONGO_DATABASE,
  MONGO_POOL_SIZE,
} = process.env;
const DatabaseName = NODE_ENV === "test"
  ? "unitest"
  : MONGO_DATABASE;

const uri = `${MONGO_URI}:${MONGO_PORT}/${DatabaseName}?poolSize=${MONGO_POOL_SIZE}&replicaSet=mongo1`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = require('./userSchema');
const friendSchema = require('./friendSchema');
const roomSchema = require('./roomSchema');
const messageSchema = require('./messageSchema');

module.exports.connection = mongoose.connection;
module.exports.userModel = mongoose.model('users', userSchema);
module.exports.friendModel = mongoose.model('friends', friendSchema);
module.exports.roomModel = mongoose.model('rooms', roomSchema);
module.exports.messageModel = mongoose.model('messages', messageSchema);
