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
    default: ''
  },
  avatar: {
    id: {
      type: String,
    },
    deletehash: {
      type: String,
    },
    type: {
      type: String,
    },
    url: {
      type: String,
      default: "https://i.imgur.com/Xou2xzT.png",     
    }
  },
  description: {
    type: String,
    default: '希望可以跟大家一起吃吃飯，認識新朋友。',
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
  phone: {
    type: String,
    default: null,
  },
  regId: {
    type: String,
    default: '',
  },
  gender: {
    type: Number,
    default: null,
    enum: [null, 0, 1]
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
