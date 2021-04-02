const mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  description: String,
  content: Object,
  upvotes: { type: Number, default: 0 },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

blogSchema.methods.upvote = function () {
  this.upvotes++;
  return this.save();
};

module.exports = mongoose.model("blog", blogSchema);
