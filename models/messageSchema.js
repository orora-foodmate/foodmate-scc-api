const mongoose = require('mongoose');
const { schemaOptions } = require('../constants/mongooseOptions');
const { now, formatDateTime } = require('../helpers/dateHelper');
const { Schema } = mongoose;

const messageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  text: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  attachment: {
    type: String,
    default: null
  },
  createAt: {
    type: Date,
    default: now,
    get: formatDateTime,
  },
}, schemaOptions);

const messagesByRoomSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'rooms',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    get: formatDateTime,
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
  messages: [messageSchema]
}, schemaOptions);

messagesByRoomSchema.pre('save', function (next) {
  let messages = this;
  messages.updateAt = now();
  next();
});

module.exports = messagesByRoomSchema;
