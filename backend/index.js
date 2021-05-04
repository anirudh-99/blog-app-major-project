const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

const userRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require('./routes/commentRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const globalErrorHandler = require("./controllers/errorController");

//env variable
dotenv.config();
app.use(cors());
app.use(morgan());
app.use(express.json());

mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connection established !");
  });

//routes
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/blogs", blogRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/bookmarks',bookmarkRoutes);
app.use("/api/public", express.static(path.join(__dirname, "uploads")));

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`server is running at port ${port}`);
});
