const Blog = require("../models/blog.model");
const Upvote = require("../models/upvote.model");
const Comment = require("../models/comment.model");
const Bookmark = require("../models/bookmark.model");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/appError");

//----------------util functions-----------------------------------

//helper function to extract image from the url of the image
const extractImageName = (src) => {
  const srcSplits = src.split("/");
  return srcSplits[srcSplits.length - 1];
};

//delete image based on image name
const deleteImage = (imgName) => {
  fs.unlink(`${__dirname}/../uploads/${imgName}`, (err) => {
    if (err) {
    }
  });
};

//-------------------------------------------------------------------

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

//used for updating the contents of the blog
exports.updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, description, content, coverImg } = { ...req.body };
  try {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        description,
        content,
        coverImg,
      },
      { omitUndefined: true }
    );

    //deletes the images which are not referenced by the current blog after updation
    const deleteNonRefImages = (oldEntityMap, newEntityMap) => {
      for (const i in oldEntityMap) {
        if (oldEntityMap[i].type != "IMAGE") continue;
        const currImgName = extractImageName(oldEntityMap[i].data.src);
        //says whether curr img is still being referenced after updation
        let imgStillReferenced = false;
        for (const j in newEntityMap) {
          if (newEntityMap[j].type != "IMAGE") continue;
          if (extractImageName(newEntityMap[j].data.src) == currImgName) {
            imgStillReferenced = true;
          }
        }
        if (!imgStillReferenced) {
          deleteImage(currImgName);
        }
      }
    };

    deleteNonRefImages(blog.content.entityMap, content.entityMap);

    return res.status(200).json({
      status: "success",
      message: "blog successfully updated",
    });
  } catch (err) {
    next(new AppError("Something went wrong while updating the blog", 500));
  }
};

//used for deleting a blog
exports.deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  const deleteImageFiles = (entityMap, coverImgUrl) => {
    let images = [];
    for (let i in entityMap) {
      if (entityMap[i].type === "IMAGE") {
        images.push(entityMap[i]);
      }
    }
    for (const image of images) {
      const imgName = extractImageName(image.data.src);
      deleteImage(imgName);
    }

    //delete cover img
    deleteImage(extractImageName(coverImgUrl));
  };

  try {
    const blog = await Blog.findOne({ _id: blogId });
    if (blog.author != userId) {
      next(new AppError("You don't have permission to delete this blog", 500));
    }
    if (blog.content.entityMap) {
      // delete all the images associated with the blog
      deleteImageFiles(blog.content.entityMap, blog.coverImg);
    }
    //delete blog
    await Blog.deleteOne({ _id: blogId, author: userId });
    //delete all the likes associated with the blog
    await Upvote.deleteMany({ blogId });
    //delete all the comments associated with the blog
    await Comment.deleteMany({ blogId });
    //delete the bookmark if this blog is bookmarked
    await Bookmark.deleteOne({ blog: blogId, userId: userId });
    return res.status(200).json({
      status: "success",
      message: "blog deleted successfully",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
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
