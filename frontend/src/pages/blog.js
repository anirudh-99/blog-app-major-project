import React, { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Typography} from '@material-ui/core';
import { API_URL } from "../constants";
import draftToHtml from "draftjs-to-html";

const initialState = {
  blog: "",
  loading: false,
  error: null,
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
        const res = await axios.get(`${API_URL}/blogs/${blogId}`);
        console.log(res);
        dispatch({
          type: "GET_BLOG_SUCCESS",
          payload: {
            blog: res.data.data.blog,
          },
        });
        const rawContent = res.data.data.blog.content;
        const markup = draftToHtml(rawContent);
        setBlogMarkup(markup);
      } catch (err) {
        dispatch({
          type: "GET_BLOG_FAILURE",
          payload: { error: "Failed to fetch the blog" },
        });
      }
    }
    fetchBlog();
  }, []);

  return (
    <>
      <h1>{state.blog.title}</h1>
      <Typography variant="caption">{state.blog.description}</Typography>
      <div dangerouslySetInnerHTML={{ __html: blogMarkup }}></div>
    </>
  );
}
