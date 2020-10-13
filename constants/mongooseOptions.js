module.exports.schemaOptions = {
  toObject: {
    getters: true,
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  toJSON: {
    getters: true,
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  runSettersOnQuery: true,
};