import React, { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import { Typography } from "@material-ui/core";
import { API_URL } from "../../constants";
import draftToHtml from "draftjs-to-html";
import clsx from "clsx";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ForumIcon from "@material-ui/icons/Forum";

import styles from "./blog.module.css";
import IconButton from "@material-ui/core/IconButton";

const initialState = {
  blog: "",
  loading: false,
  error: null,
  isUpvoted: false,
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
        dispatch({ type: "GET_BLOG_REQUEST" });
        let res = await axios.get(`/blogs/${blogId}`);
        dispatch({
          type: "GET_BLOG_SUCCESS",
          payload: {
            blog: res.data.data.blog,
          },
        });
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

  return (
    <div style={{ display: "flex" }}>
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
            <IconButton>
              <ForumIcon fontSize="large" />
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
        </header>
        <div
          className={styles.blogContent}
          dangerouslySetInnerHTML={{ __html: blogMarkup }}
        ></div>
      </div>
    </div>
  );
}
