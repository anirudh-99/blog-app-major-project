import React, { useState, useEffect } from "react";
import axios from "../../axios";
import moment from "moment";
import HorizontalBlogCard from "../horizontalBlogCard";
import styles from "./publishedPosts.module.css";

export default function PublishedPosts({ userId }) {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    async function getPublishedBlogs() {
      try {
        const res = await axios.get(`/users/publishedPosts/${userId}`);
        setBlogs(res.data.data.blogs);
      } catch (err) {
        //todo: handle error message
        console.log(err.response);
      }
    }
    getPublishedBlogs();
  }, []);

  const renderBlogCards = () => {
    return blogs.map((blog) => (
      <HorizontalBlogCard
        title={blog.title}
        description={blog.description}
        likes={blog.upvotes}
        time={formatTime(blog.createdAt)}
        coverImg={blog.coverImg}
        blogId={blog._id}
      />
    ));
  };

  const formatTime = (time) => {
    return moment.utc(time).format("MMMM DD, YYYY");
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.mainHeading}>Published Posts</p>
      <div className={styles.blogsContainer}>
        {blogs.length > 0 ? renderBlogCards() : <h2>No published blogs.</h2>}
      </div>
    </div>
  );
}
