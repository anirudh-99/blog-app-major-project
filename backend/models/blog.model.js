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
},{timestamps: true});

module.exports = mongoose.model("blog", blogSchema);
