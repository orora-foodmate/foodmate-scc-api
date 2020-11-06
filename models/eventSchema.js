const mongoose = require("mongoose");
const isArray = require('lodash/isArray');
const { schemaOptions } = require("../constants/mongooseOptions");
const { Schema } = mongoose;
const { now, formatDateTime } = require("../helpers/dateHelper");

const userSelectFields = 'account name avatar room';

const tagSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

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
});

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
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
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'users',
    }],
    meetingGeoJson: {
      type: {
        type: String,
        enum: [
          "Point",
          "LineString",
          "Polygon",
          "MultiPoint",
          "MultiPolygon",
          "GeometryCollection",
        ],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
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
  this.users = isArray(this.users)
    ? [...this.users, this.creator]
    : [this.creator];
  next();
});

eventSchema.statics.findEvent = function findEvent(query, options) {
  return this.findOne(query, options)
    .populate({ path: "users", select: userSelectFields })
    .populate({ path: "creator", select: userSelectFields })
    .exec();
};

eventSchema.statics.findEventById = function findEventById(eventId) {
  return this.findById(eventId)
    .populate({ path: "users", select: userSelectFields })
    .populate({ path: "creator", select: userSelectFields })
    .exec();
};


eventSchema.statics.findEvents = function findEvents(
  query = {},
  options = {}
) {
  return this.find(query, options)
    .populate({ path: "users", select: userSelectFields })
    .populate({ path: "creator", select: userSelectFields })
    .exec();
};

module.exports = eventSchema;
