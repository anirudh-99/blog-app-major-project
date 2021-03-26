const express = require("express");
const multer = require("multer");
const Router = express.Router();

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

Router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { path, mimetype } = req.file;
    const fileName = path.split("/")[1];
    res
      .status(200)
      .json({
        status: "success",
        message: "file uploaded succesfully",
        data: { fileName },
      });
  } catch (err) {
    res.status(400).send("Error while uploading file. Try again.");
  }
});

module.exports = Router;
