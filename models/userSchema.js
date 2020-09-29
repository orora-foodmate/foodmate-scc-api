const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const { saltHashPassword } = require('../helpers/utils');

const { Schema } = mongoose;

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
  let user = this;

  // only hash the password if it has been modified (or is new)
  if(isEmpty(user.password)) throw new Error('password is required');

  user.hashPassword  = saltHashPassword(user.password);
  next();
});

userSchema.pre('save',  function(next) {
  let user = this;
  user.updateAt = Date.now();
  next();
});

module.exports = userSchema;
