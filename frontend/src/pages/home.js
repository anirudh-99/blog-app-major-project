import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../redux/actions/index";
import { Grid, makeStyles } from "@material-ui/core";

import BlogCard from "../Components/blogCard";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(2),
  },
  gridItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function Home() {
  const dispatch = useDispatch();
  const blogsState = useSelector((state) => state.blogs);
  const classes = useStyles();

  React.useEffect(() => {
    if (blogsState.blogs.length === 0) {
      dispatch(getBlogs());
    }
  });

  const formatTime = (time) => {
    return moment.utc(time).format("MMMM d, YYYY");
  };
  return (
    <Grid container spacing={2} className={classes.grid}>
      {blogsState.blogs.map((blog) => (
        <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
          <BlogCard
            key={blog._id}
            id={blog._id}
            title={blog.title}
            description={blog.description}
            coverImg={blog.coverImg}
            author={blog.author.name}
            time={formatTime(blog.createdAt)}
            likes={blog.upvotes}
          />
        </Grid>
      ))}
    </Grid>
  );
}
