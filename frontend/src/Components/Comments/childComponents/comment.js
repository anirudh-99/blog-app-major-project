import React, { useState, useEffect, useContext, createContext } from "react";
import styled from "styled-components";
import Markdown from "markdown-to-jsx";
import moment from "moment";

import CommentContext from "../commentContext";
import Reply from "./reply";

export const gen_comments = (comments, path) => {
  return comments.map((comment, i) => {
    return (
      <Comment
        id={comment.id}
        authorName={comment.authorName}
        date={comment.date}
        content={comment.content}
        key={comment.id}
        path={[...path, i]}
        comments={comment.comments}
      />
    );
  });
};

function compare(a1, a2) {
  if (JSON.stringify(a1) === JSON.stringify(a2)) {
    return true;
  } else return false;
}

let Comment = ({
  path,
  id,
  authorName,
  authorId,
  date,
  content,
  comments,
  ...props
}) => {
  const { replying, setReplying, blogId } = useContext(CommentContext);
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (path.length > 2 && path.length % 2 === 0) {
      setHidden(true);
    }
    //if the current comment is 3rd or even higher sibling then hide it
    if (path[path.length - 1] > 3) {
      setHidden(true);
    }
  }, []);

  return (
    <div {...props}>
      {hidden ? (
        <button id="showMore" onClick={() => setHidden(false)}>
          Show More Replies
        </button>
      ) : (
        <div id={id}>
          <div id="right">
            <div id="top">
              <span
                className="minimize"
                onClick={() => setMinimized((minimized) => !minimized)}
              >
                [{minimized ? "+" : "-"}]
              </span>
              <span id="name">{authorName}</span>
              <span id="date">{moment(date).fromNow()}</span>
            </div>
            <div id="content" className={minimized ? "hidden" : ""}>
              <Markdown options={{ forceBlock: true }}>{content}</Markdown>
            </div>
            <div id="actions" className={minimized ? "hidden" : ""}>
              <span
                className={`${compare(replying, path) ? "selected" : ""}`}
                onClick={() => {
                  if (compare(replying, path)) {
                    setReplying([]);
                  } else {
                    setReplying(path);
                  }
                }}
              >
                reply
              </span>
            </div>
            <Reply
              className={`${
                compare(replying, path) && !minimized ? "" : "hidden"
              } commentReply`}
              parentId={id}
            />
            <div className={`comments ${minimized ? "hidden" : ""}`}>
              {gen_comments(comments, [...path])}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Comment = styled(Comment)`
  text-align: left;
  padding: 16px 16px 16px 45px;
  border-left: 1px solid grey;

  #showMore {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    text-align: left;

    &:hover {
      text-decoration: underline;
    }
  }

  .comments {
    > * {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0px;
      }
    }

    &.hidden {
      display: none;
    }
  }

  #top {
    .minimize {
      cursor: pointer;
      color: #53626f;
      user-select: none;
    }

    #name {
      color: #4f9eed;
    }

    #date {
      display: inline-block;
      color: #53626f;
    }

    > * {
      margin-right: 8px;
    }
  }

  #content {
    color: black;
    &.hidden {
      display: none;
    }
  }

  #actions {
    color: #53626f;
    margin-bottom: 12px;
    user-select: none;

    &.hidden {
      display: none;
    }

    > .selected {
      font-weight: bold;
    }

    > * {
      cursor: pointer;
      margin-right: 8px;
    }
  }

  .commentReply {
    margin-bottom: 12px;
  }
`;

export default Comment;
