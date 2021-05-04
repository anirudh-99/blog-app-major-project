const Bookmark = require("../models/bookmark.model");

//bookmarks a particular blog
exports.bookmarkBlog = async (req, res, next) => {
  const blogId = req.params.blogId;
  const userId = req.user.id;

  try {
    const bookmarkedBefore = await Bookmark.find({
      blog: blogId,
      userId,
    }).count();

    if (!bookmarkedBefore) {
      await Bookmark.create({ blog: blogId, userId });
      return res.status(200).json({
        status: "success",
        message: "Blog has been bookmarked.",
      });
    } else {
      //else downvote the blog
      await Bookmark.deleteOne({ userId, blog: blogId });
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

//checks whether a particular blog is bookmarked by the user or not
exports.bookmarkedBefore = async (req, res, next) => {
  const blogId = req.params.blogId;
  const userId = req.user.id;

  try {
    const isBookmarked = await Bookmark.find({ blog: blogId, userId }).count();
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

//returns all the bookmarks done by a particular user
exports.getBookmarks = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const bookmarks = await Bookmark.find({ userId }).populate(
      "blog",
      "title description coverImg"
    );
    return res.status(200).json({
      status: "success",
      data: {
        bookmarks,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "Unable to retrieve bookmarks",
    });
  }
};

//deletes a bookmark given Id of the bookmark
exports.deleteBookmark = async (req, res, next) => {
  const bookmarkId = req.params.bookmarkId;

  try {
    await Bookmark.deleteOne({ _id: bookmarkId });
    return res.status(200).json({
      status: "success",
      message: "bookmark deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "unable to delete the bookmark",
    });
  }
};
