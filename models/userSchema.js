const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const { schemaOptions } = require('../constants/mongooseOptions');
const { now, formatDateTime } = require('../helpers/dateHelper');
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
  regId: {
    type: String,
    unique: true,
    default: '',
  },
  createAt: {
    type: Date,
    default: now,
    get: formatDateTime,
  },
  updateAt: {
    type: Date,
    default: now,
    get: formatDateTime,
  },
}, schemaOptions);

userSchema.pre('save',  function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if(isEmpty(user.password)) throw new Error('password is required');

  user.hashPassword  = saltHashPassword(user.password);
  next();
});

userSchema.pre('save',  function(next) {
  let user = this;
  user.updateAt = now();
  next();
});

module.exports = userSchema;
