import React, { useEffect, useState } from "react";
import axios from "../../axios";
import BookmarkCard from "../../Components/bookmarkCard";
import styles from "./bookmarks.module.css";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        let res = await axios.get("/bookmarks");
        setBookmarks(res.data.data.bookmarks);
        console.log(bookmarks);
      } catch (err) {
        //todo: handle error messages
        console.log(err.response);
      }
    }
    fetchBookmarks();
  }, []);

  const deleteHandler = async (id) => {
    try{
      await axios.delete(`/bookmarks/${id}`);
    }
    catch(err){
      //todo: handle error messages
      console.log(err.response);
    }

    setBookmarks(bookmarks.filter((el) => el._id !== id));
  };

  return (
    <div className={styles.bookmarksContainer}>
      <h1 className={styles.bookmarksHeading}>Bookmarks</h1>
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <BookmarkCard
            title={bookmark.blog.title}
            description={bookmark.blog.description}
            coverImg={bookmark.blog.coverImg}
            blogId={bookmark.blog._id}
            key={bookmark._id}
            id={bookmark._id}
            deleteHandler={deleteHandler}
          />
        ))
      ) : (
        <h1>No bookmarks</h1>
      )}
    </div>
  );
}
