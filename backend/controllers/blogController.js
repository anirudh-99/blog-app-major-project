const Blog = require("../models/blog.model");
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
exports.getBlogs = async(req,res,next) => {
  

};

//used for retrieving a particular blog using blog id
exports.getBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  res.status(200).json({
    status: "success",
    data: { blog },
  });
};
