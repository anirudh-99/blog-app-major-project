import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import TextArea from "react-textarea-autosize";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import axios from "../../../axios";
import CommentContext from "../commentContext";

let Reply = (props) => {
  const [text, setText] = useState("");
  const auth = useSelector((state) => state.auth);
  const { replying, setReplying, blogId } = useContext(CommentContext);

  const sendComment = async (e) => {
    //todo: handle error
    try {
      await axios.post(
        `/comments/${blogId}`,
        {
          parentId: props.parentId,
          content: text,
        },
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {
      console.log(err.response);
    } finally {
      setReplying([]);
      window.location.reload();
    }
  };

  return (
    <div {...props}>
      <TextArea
        placeholder="what are your thoughts?"
        minRows={2}
        defaultValue={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="panel">
        <div className="commentAs">Comment as {` ${auth?.user?.name}`}</div>
        <Button
          className="button"
          variant="contained"
          color="primary"
          size="small"
          onClick={sendComment}
        >
          comment
        </Button>
      </div>
    </div>
  );
};

Reply = styled(Reply)`
  border-radius: 8px;
  border: solid 1px black;
  overflow: hidden;

  &.hidden {
    display: none;
  }

  textarea {
    font-family: inherit;
    box-sizing: border-box;

    padding: 12px;
    border: none;
    min-width: 100%;
    max-width: 100%;

    &:focus {
      outline: none;
    }
  }

  .panel {
    display: flex;
    align-items: center;
    padding: 8px;
    background: rgb(14, 17, 17);
  }

  .commentAs {
    font-size: 14px;
    color: white;
    margin-right: 8px;
  }

  .button {
    font-size: 11px;
    margin-left: auto;
    background: white;
    color: black;
  }
`;

export default Reply;
