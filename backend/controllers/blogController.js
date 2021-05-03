const Blog = require("../models/blog.model");
const Upvote = require("../models/upvote.model");
const Bookmark = require("../models/bookmark.model");
const path = require("path");
const AppError = require("../utils/appError");

//used for creating a new blog
exports.createBlog = async (req, res, next) => {
  try {
    const { title, description, content, author, coverImg } = { ...req.body };

    await Blog.create({
      title,
      description,
      content,
      author,
      coverImg,
    });
    res.status(201).json({
      status: "success",
      message: "blog has been created",
    });
  } catch (err) {
    next(new AppError("Something went wrong while creating the blog", 500));
  }
};

//used for retrieving all the blogs
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}, { content: 0 }).populate(
      "author",
      "name"
    );
    res.status(200).json({
      status: "success",
      data: { blogs },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "cannot retrieve the blogs",
    });
  }
};

//used for retrieving a particular blog using blog id
exports.getBlog = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId).populate("author", "name");
    res.status(200).json({
      status: "success",
      data: { blog },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "Failed to fetch the blog",
    });
  }
};

//used for upvoting a particular blog and if it's already upvoted then it removes an upvote
exports.upvoteBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user.id;
  try {
    const upvotedBefore = await Upvote.find({ userId, blogId }).count();
    //if the user hasn't upvoted before then upvote
    if (!upvotedBefore) {
      await Upvote.create({ blogId, userId });
      await Blog.updateOne({ _id: blogId }, { $inc: { upvotes: 1 } });
      return res.status(200).json({
        status: "success",
        message: "Blog upvoted.",
      });
    } else {
      //else downvote the blog
      await Upvote.deleteOne({ userId, blogId });
      await Blog.updateOne({ _id: blogId }, { $inc: { upvotes: -1 } });
      return res.status(200).json({
        status: "success",
        message: "Blog downvoted.",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "upvote/downvote operation failed",
    });
  }
};

//checks whether the current user has upvoted the blog or not
exports.upvotedBefore = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const isUpvoted = await Upvote.find({ blogId, userId }).count();
    return res.status(200).json({
      status: "success",
      data: {
        upvotedBefore: isUpvoted,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "failed to retrieve upvote info",
    });
  }
};

//bookmarks a particular blog
exports.bookmarkBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const bookmarkedBefore = await Bookmark.find({ blogId, userId }).count();

    if (!bookmarkedBefore) {
      await Bookmark.create({ blogId, userId });
      return res.status(200).json({
        status: "success",
        message: "Blog has been bookmarked.",
      });
    } else {
      //else downvote the blog
      await Bookmark.deleteOne({ userId, blogId });
      return res.status(200).json({
        status: "success",
        message: "Blog has been removed from bookmarks.",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "bookmark operation has been failed",
    });
  }
};

exports.bookmarkedBefore = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const isBookmarked = await Bookmark.find({ blogId, userId }).count();
    return res.status(200).json({
      status: "success",
      data: {
        bookmarkedBefore: isBookmarked,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "failed to retrieve bookmark info",
    });
  }
};
