const mongoose = require('mongoose');
const { schemaOptions } = require('../constants/mongooseOptions');
const { now, formatDateTime } = require('../helpers/dateHelper');
const { Schema } = mongoose;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users' ,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    }
  ],
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
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0
  },
  type: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
}, schemaOptions);

roomSchema.pre('save',  function(next) {
  let user = this;
  user.updateAt = now();
  next();
});

module.exports = roomSchema;

