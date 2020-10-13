const mongoose = require('mongoose');
const { schemaOptions } = require('../constants/mongooseOptions');
const { now, formatDateTime } = require('../helpers/dateHelper');
const { Schema } = mongoose;

const friendSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'users',
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
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
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
}, schemaOptions);

friendSchema.pre('save',  function(next) {
  let user = this;
  user.updateAt = now();
  next();
});

module.exports = friendSchema;
