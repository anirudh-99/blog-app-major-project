const express = require("express");
const Router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

Router.get(
  "/publishedPosts/:userId",
  authController.protect,
  userController.getPublishedBlogsByUser
);

Router.get(
  "/comments/:userId",
  authController.protect,
  userController.getCommentsByUser
);

module.exports = Router;
