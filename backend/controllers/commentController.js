const Comment = require("../models/comment.model");

exports.addComment = async (req, res) => {
  const blogId = req.params.blogId;
  const author = {
    id: req.user.id,
    name: req.user.name,
  };
  const { parentId, depth, content } = req.body;
  try {
    await Comment.create({
      blogId,
      author,
      parentId,
      depth,
      content,
    });
    res.status(201).json({
      status: "success",
      message: "comment successfully created",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

//used for creating the nested comments object
const createCommentsThread = (comments, parentId = null) => {
  const commentsThread = [];
  let filteredComments = comments.filter(
    (comment) => comment.parentId == parentId
  );
  for (let comment of filteredComments) {
    commentsThread.push({
      id: comment.id,
      authorName: comment.author.name,
      authorId: comment.author.Id,
      content: comment.content,
      date: comment.createdAt,
      comments: createCommentsThread(comments, comment.id),
    });
  }
  return commentsThread;
};

exports.getComments = async (req, res) => {
  const blogId = req.params.blogId;
  try {
    const comments = await Comment.find({ blogId }).sort({ createdAt: 1 });
    const commentsThread = createCommentsThread(comments);
    res.status(200).json({
      status: "success",
      data: {
        comments: commentsThread,
        count: comments.length,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "failed to fetch the comments",
    });
  }
};
