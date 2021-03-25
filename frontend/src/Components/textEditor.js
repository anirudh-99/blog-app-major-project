import React, { useState } from "react";
import { convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TextEditor = (props) => {
  const [contentState, setContentState] = useState(null);

  return (
    <>
      <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onContentStateChange={setContentState}
      />
    </>
  );
};

export default TextEditor;
