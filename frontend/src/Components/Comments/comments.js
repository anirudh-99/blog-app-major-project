import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "../../axios";

import Reply from "./childComponents/reply";
import { gen_comments } from "./childComponents/comment";
import CommentContext from "./commentContext";

let Comments = (props) => {
  const [replying, setReplying] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      //todo: handle error
      try {
        const res = await axios.get(`/comments/${props.blogId}`);
        setComments(res.data.data.comments);
        setCommentsCount(res.data.data.count);
      } catch (err) {}
    };
    fetchComments();
  }, []);

  return (
    <div {...props}>
      <h1>Comments({commentsCount})</h1>
      <Reply />
      {comments.length === 0 ? (
        <h1>No Comments.</h1>
      ) : (
        <CommentContext.Provider
          value={{ replying, setReplying, blogId: props.blogId }}
        >
          {gen_comments(comments, [])}
        </CommentContext.Provider>
      )}
    </div>
  );
};

Comments = styled(Comments)`
  max-width: 70vw;
  min-width: min-content;

  > * {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0px;
    }
  }
`;

export default Comments;
