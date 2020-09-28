const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
  MONGO_URI,
  MONGO_PORT,
  MONGO_DATABASE,
  MONGO_POOL_SIZE,
} = process.env;

const uri = `${MONGO_URI}:${MONGO_PORT}/${MONGO_DATABASE}?poolSize=${MONGO_POOL_SIZE}`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports.userModel = mongoose.model('users', userSchema);
