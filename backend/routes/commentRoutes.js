const express = require("express");
const Router = express.Router();

const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

Router.get("/:blogId", authController.protect, commentController.getComments);
Router.post("/:blogId", authController.protect, commentController.addComment);

module.exports = Router;
