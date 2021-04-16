const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
    author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      name: String,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
