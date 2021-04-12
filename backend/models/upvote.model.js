const mongoose = require("mongoose");

let upvoteSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

upvoteSchema.index({ blogId: 1, userId: 1 });

module.exports = mongoose.model("upvote", upvoteSchema);
