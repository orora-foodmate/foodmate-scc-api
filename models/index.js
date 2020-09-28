const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const { saltHashPassword } = require('../helpers/utils');

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
    default: "http://clipart-library.com/images/6cpoy78ri.png",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users' ,
    default: null
  },
  password: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
  },
  account: {
    type: String,
    unique: true,
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

userSchema.pre('save',  function(next) {
  console.log('AL: next', next)
  let user = this;

  // only hash the password if it has been modified (or is new)
  if(isEmpty(user.password)) throw new Error('password is required');

  user.hashPassword  = saltHashPassword(user.password);
  next();
});

module.exports.userModel = mongoose.model('users', userSchema);
