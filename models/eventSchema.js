const mongoose = require("mongoose");
const isArray = require('lodash/isArray');
const { schemaOptions } = require("../constants/mongooseOptions");
const { Schema } = mongoose;
const { now, formatDateTime } = require("../helpers/dateHelper");
const isEmpty = require('lodash/isEmpty');
const isAfter = require('date-fns/isAfter');
const parseISO = require('date-fns/parseISO');

const userSelectFields = '-password -hashPassword -createAt -updateAt';
const creatorSelectFields = ['avatar', 'phone', 'gender', 'name', 'account', 'id'];

const termSchema = new Schema({
  offset: {
    type: Number
  },
  value: {
    type: String
  }
}, schemaOptions);

const eventUserSchema = new Schema({
  info: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  status: {
    type: Number,
    default: 0,
    enum: [0, 1], //[0: 等待審核中, 1: 已經通過審核]
  }
}, schemaOptions);

const tagSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, schemaOptions);

const commentSchema = new Schema({
  status: {
    type: Number,
    enum: [0, 1, 2], //[0: active, 1: 已刪除, 2: 被檢舉]
    default: 0,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  content: {
    type: String,
    required: true,
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

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    logo: {
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
        required: true,
      }
    },
    room: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    publicationPlace: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    users: [eventUserSchema],
    place: {
      description: {
        type: String,
      },
      place_id: {
        type: String,
      },
      structured_formatting: {
        main_text: {
          type: String,
        },
        secondary_text: {
          type: String,
          default: ''
        }
      },
      types: [{ type: String }],
      terms: [termSchema]
    },
    userCountMax: { // 最高參與人數
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      enum: [0, 1, 2], //[0: 休閒, 1: 活動, 2: 商業]
      default: 0,
    },
    status: {
      type: Number,
      enum: [0, 1, 2], //[0: 已建立, 1: 已滿團, 2: 已結束]
      default: 0,
      min: 0,
      max: 2,
    },
    paymentMethod: {
      type: Number,
      enum: [0, 1, 2, 3], //[0:  各付各的, 1: 平均分攤, 2: 主揪請客, 3: 團友請客]
      default: 0,
      min: 0,
      max: 3,
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalReviewAt: {
      type: Date,
      required: true,
      get: formatDateTime,
    },
    datingAt: {
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
    comments: [commentSchema],
    tags: [tagSchema]
  },
  schemaOptions
);

eventSchema.pre('save', function (next) {
  if (!isArray(this.comments)) this.comments = [];
  if (!isArray(this.tags)) this.tags = [];
  if (!isArray(this.users)) this.users = [];
  this.updateAt = now();
  next();
});

eventSchema.statics.findEvent = function findEvent(query) {
  return this.findOne(query, '-tags -comments')
    .populate({ path: "users.info", select: userSelectFields })
    .populate({ path: "creator", select: creatorSelectFields.join(' ') })
    .exec();
};

eventSchema.statics.findEventById = function findEventById(eventId) {
  return this.findById(eventId, '-tags -comments')
    .populate({ path: "users.info", select: userSelectFields })
    .populate({ path: "creator", select: [...creatorSelectFields, 'regId'].join(' ') })
    .exec();
};


eventSchema.statics.findEvents = function findEvents(
  query = {},
) {
  return this.find(query, '-tags -comments')
    .populate({ path: "users.info", select: userSelectFields })
    .populate({ path: "creator", select: creatorSelectFields.join(' ') })
    .exec();
};

eventSchema.statics.findComments = async function findComments(eventId, { updateAt }) {
  const { comments } = await this.findById(eventId, 'comments').exec();
  if (isEmpty(updateAt)) {
    return comments;
  }

  return comments.filter(comment => isAfter(parseISO(comment.updateAt), parseISO(updateAt)));
};

module.exports = {
  eventSchema,
  eventUserSchema,
  tagSchema,
  commentSchema,
};
