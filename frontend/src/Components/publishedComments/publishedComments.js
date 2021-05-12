import React, { useState, useEffect } from "react";
import ProfileCommentCard from "../profileCommentCard";
import axios from "../../axios";
import moment from 'moment';

export default function PublishedComments({ userId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function getComments() {
      try {
        const res = await axios.get(`/users/comments/${userId}`);
        setComments(res.data.data.comments);
      } catch (err) {
        //todo: handle error
      }
    }
    getComments();
  }, []);

  const renderCommentCards = () => {
    return comments.map((comment) => (
      <ProfileCommentCard
        time={moment(comment.createdAt).fromNow()}
        id={comment._id}
        blogId={comment.blogId}
        commentContent={comment.content}
      />
    ));
  };

  return (
    <div>
      <h2>Comments</h2>
      {comments.length === 0 ? <h3>No Comments</h3> : renderCommentCards()}
    </div>
  );
}
