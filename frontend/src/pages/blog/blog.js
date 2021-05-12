import React, { useReducer, useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import axios from "../../axios";
import { Typography } from "@material-ui/core";
import { API_URL } from "../../constants";
import draftToHtml from "draftjs-to-html";
import clsx from "clsx";
import moment from 'moment';

import Comments from "../../Components/Comments/comments";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ForumIcon from "@material-ui/icons/Forum";

import styles from "./blog.module.css";
import IconButton from "@material-ui/core/IconButton";

const initialState = {
  blog: "",
  loading: false,
  error: null,
  isUpvoted: false,
  isBookmarked: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_BLOG_REQUEST":
      state = {
        ...state,
        loading: true,
      };
      break;
    case "GET_BLOG_SUCCESS":
      state = {
        ...state,
        blog: action.payload.blog,
        loading: false,
      };
      break;
    case "GET_BLOG_FAILURE":
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    case "TOGGLE_IS_UPVOTED":
      state = {
        ...state,
        isUpvoted: !state.isUpvoted,
      };
      break;
    case "UPVOTE":
      state = {
        ...state,
        blog: {
          ...state.blog,
          upvotes: state.isUpvoted
            ? state.blog.upvotes - 1
            : state.blog.upvotes + 1,
        },
        isUpvoted: !state.isUpvoted,
      };
      break;
    case "TOGGLE_IS_BOOKMARKED":
      state = {
        ...state,
        isBookmarked: !state.isBookmarked,
      };
      break;
    default:
      break;
  }
  return state;
};

export default function Blog() {
  const { id: blogId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [blogMarkup, setBlogMarkup] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      try {
        //fetch the contents of the blog
        dispatch({ type: "GET_BLOG_REQUEST" });
        let res = await axios.get(`/blogs/${blogId}`);
        dispatch({
          type: "GET_BLOG_SUCCESS",
          payload: {
            blog: res.data.data.blog,
          },
        });
        console.log(res.data.data);
        const rawContent = res.data.data.blog.content;
        const markup = draftToHtml(rawContent);
        setBlogMarkup(markup);

        //check if the blog is already upvoted by the user
        res = await axios.get(`/blogs/${blogId}/upvotedBefore`);
        if (res.data.data.upvotedBefore) {
          dispatch({
            type: "TOGGLE_IS_UPVOTED",
          });
        }

        //check if blog is already upvoted by the user
        res = await axios.get(`/bookmarks/${blogId}/bookmarkedBefore`);
        if (res.data.data.bookmarkedBefore) {
          dispatch({ type: "TOGGLE_IS_BOOKMARKED" });
        }
      } catch (err) {
        dispatch({
          type: "GET_BLOG_FAILURE",
          payload: { error: "Failed to fetch the blog" },
        });
      }
    }
    fetchBlog();
  }, []);

  //todo: properly handle error message
  const handleLikeButton = (e) => {
    dispatch({ type: "UPVOTE" });
    axios
      .post(`/blogs/${blogId}/upvote`)
      .then((res) => {})
      .catch((err) => {});
  };

  //todo: properly handle error message
  const handleBookmarkButton = (e) => {
    dispatch({ type: "TOGGLE_IS_BOOKMARKED" });
    axios
      .post(`/bookmarks/${blogId}`)
      .then((res) => {})
      .catch((err) => {});
  };

  const formatTime = (time) => {
    return moment.utc(time).format("MMMM DD, YYYY");
  };

  return (
    <>
      <div style={{ display: "flex", scrollBehavior: "smooth" }}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarIconsWrapper}>
            <div className={styles.likeButton}>
              <IconButton onClick={handleLikeButton}>
                <ThumbUpIcon
                  fontSize="large"
                  className={clsx(state.isUpvoted && styles.likeButtonRed)}
                />
              </IconButton>
              {state.blog.upvotes}
            </div>
            <div>
              <IconButton href="#comments">
                <ForumIcon fontSize="large" />
              </IconButton>
            </div>
            <div>
              <IconButton onClick={handleBookmarkButton}>
                <BookmarkBorderIcon
                  fontSize="large"
                  className={clsx(
                    state.isBookmarked && styles.bookmarkButtonRed
                  )}
                />
              </IconButton>
            </div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <header className={styles.blogHeader}>
            <h1 className={styles.blogTitle}>
              <span>{state.blog.title}</span>
            </h1>
            <h2 className={styles.blogDescription}>{state.blog.description}</h2>
            <h4 className={styles.blogMetaData}>
              Written by <Link className={styles.authorLink}>{state.blog.author?.name}</Link><span className={styles.separator}>·</span> 
              {formatTime(state.blog.createdAt)}
            </h4>
          </header>
          <div
            className={styles.blogContent}
            dangerouslySetInnerHTML={{ __html: blogMarkup }}
          ></div>
        </div>
      </div>
      <Comments id="comments" blogId={blogId} className={styles.comments} />
    </>
  );
}
