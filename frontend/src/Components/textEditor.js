import React, { useState, useEffect } from "react";
import { convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { API_URL } from "../constants";

import axios from "axios";

const uploadImageCallback = (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${API_URL}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.data.fileName);
        const url = API_URL + "/public/" + res.data.data.fileName;
        resolve({ data: { link: url } });
      })
      .catch((err) => reject(err.response.data));
  });
};

const TextEditor = (props) => {
  const [rawContentState, setRawContentState] = useState(null);

  const upload = () => {
    const markup = draftToHtml(rawContentState);
    console.log(markup);
  };

  return (
    <>
      <Editor
        style={{ width: "700px" }}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        editorStyle={{
          width: "91%",
          border: "1px solid grey",
          padding: "4px",
          marginLeft: "30px",
        }}
        toolbarStyle={{
          width: "90%",
          border: "1px solid grey",
          paddingRight: "7px",
          marginLeft: "30px",
        }}
        wrapperStyle={{ margin: "15px" }}
        onContentStateChange={setRawContentState}
        toolbar={{
          image: {
            uploadCallback: uploadImageCallback,
            alt: { present: true, mandatory: false },
          },
        }}
      />
      <button onClick={upload}>Upload</button>
    </>
  );
};

export default TextEditor;