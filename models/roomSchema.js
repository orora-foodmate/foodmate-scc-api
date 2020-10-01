const mongoose = require('mongoose');
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
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
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
});

roomSchema.pre('save',  function(next) {
  let user = this;
  user.updateAt = Date.now();
  next();
});

module.exports = roomSchema;

