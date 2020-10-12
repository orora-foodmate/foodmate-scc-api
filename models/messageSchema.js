const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'rooms',
    required: true,
  },
  date: {
    type: Date,
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
  messages: [
    {
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
        default: Date.now,
      },
    }
  ]
});

messageSchema.pre('save',  function(next) {
  let messages = this;
  messages.updateAt = Date.now();
  next();
});

module.exports = messageSchema;
