const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");

exports.getPublishedBlogsByUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const blogs = await Blog.find({ author: userId }, { content: 0 });
    res.status(200).json({
      status: "success",
      data: {
        blogs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "Unable to fetch the blogs",
    });
  }
};

exports.getCommentsByUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const comments = await Comment.find({ "author.id": userId });
    res.status(200).json({
      status: "success",
      data: { comments },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "Unable to fetch the comments",
    });
  }
};
