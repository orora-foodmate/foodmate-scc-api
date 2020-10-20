const mongoose = require("mongoose");
const pick = require('lodash/pick');
const { schemaOptions } = require("../constants/mongooseOptions");
const { now, formatDateTime } = require("../helpers/dateHelper");
const { Schema } = mongoose;

const userSelectFields = 'account name avatar room';
const friendSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId(),
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
      default: 0,
    },
  },
  schemaOptions
);

friendSchema.pre("save", function (next) {
  let user = this;
  user.updateAt = now();
  next();
});

friendSchema.statics.findFriends = function findFriends(
  query = {},
  options = {}
) {
  return this.find(query, options)
    .populate({ path: "users", select: userSelectFields })
    .populate({ path: "creator", select: userSelectFields })
    .exec();
};

friendSchema.statics.findFriend = function findFriend(query, options) {
  return this.findOne(query, options)
    .populate({ path: "users", select: userSelectFields })
    .populate({ path: "creator", select: userSelectFields })
    .exec();
};

friendSchema.statics.findFriendById = function findFriendById(friendId) {
  return this.findById(friendId)
    .populate({ path: "users", select: userSelectFields })
    .populate({ path: "creator", select: userSelectFields })
    .exec();
};

friendSchema.statics.findFriendByUsers = function findFriendByUsers(userId, targetUserId) {
return this.findFriend({$or: [
  {users: [userId, targetUserId]},
  {users: [targetUserId, userId]},
]})
}

friendSchema.methods.toFriend = function toFriend(userId) {
  const userItem = this.users.find(u => u.id.toString() !== userId);
  const friendItem = pick(this, ['status', 'createAt', 'updateAt']);
  return {
    ...userItem.toJSON(),
    ...friendItem,
    friendId: this.id,
    creator: this.creator,
   };
}

module.exports = friendSchema;
