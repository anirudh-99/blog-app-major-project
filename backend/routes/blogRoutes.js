const express = require("express");
const Router = express.Router();
const multer = require("multer");

const BlogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./uploads");
    },
    filename(req, file, cb) {
      cb(null, `${generateId()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 4000000, //maxsize = 4 mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error("only upload files with jpeg,jpg,png"));
    }
    cb(undefined, true);
  },
});

Router.route("/")
  .get(authController.protect, BlogController.getBlogs)
  .post(authController.protect, BlogController.createBlog);

Router.route("/:id")
  .get(authController.protect, BlogController.getBlog)
  .patch(authController.protect, BlogController.updateBlog)
  .delete(authController.protect, BlogController.deleteBlog);

Router.post("/:id/upvote", authController.protect, BlogController.upvoteBlog);

Router.get(
  "/:id/upvotedBefore",
  authController.protect,
  BlogController.upvotedBefore
);

module.exports = Router;
