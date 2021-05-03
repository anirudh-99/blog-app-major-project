const mongoose = require("mongoose");

let bookmarkSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

bookmarkSchema.index({ blogId: 1, userId: 1 });

module.exports = mongoose.model("bookmark", bookmarkSchema);