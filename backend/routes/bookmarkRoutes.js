const express = require("express");
const Router = express.Router();

const authController = require("../controllers/authController");
const BookmarkController = require("../controllers/bookmarkController");

Router.route("/").get(authController.protect, BookmarkController.getBookmarks);

Router.route("/:blogId").post(
  authController.protect,
  BookmarkController.bookmarkBlog
);

Router.delete(
  "/:bookmarkId",
  authController.protect,
  BookmarkController.deleteBookmark
);

Router.get(
  "/:blogId/bookmarkedBefore",
  authController.protect,
  BookmarkController.bookmarkedBefore
);

module.exports = Router;
