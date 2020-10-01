const mongoose = require('mongoose');
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
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
});

friendSchema.pre('save',  function(next) {
  let user = this;
  user.updateAt = Date.now();
  next();
});

module.exports = friendSchema;
