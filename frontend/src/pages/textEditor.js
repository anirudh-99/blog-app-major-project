import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { API_URL, initialContentState } from "../constants";
import { makeStyles, Grid, TextField, Button } from "@material-ui/core";
import { Photo as PhotoIcon } from "@material-ui/icons";

import axios from "axios";
import { useSelector } from "react-redux";

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
        const url = API_URL + "/public/" + res.data.data.fileName;
        resolve({ data: { link: url } });
      })
      .catch((err) => reject(err.response.data));
  });
};

const useStyles = makeStyles((theme) => ({
  form: {
    margin: "16px auto",
    width: "89%",
  },
  uploadField: {
    display: "none",
  },
  uploadButton: {
    padding: "13px 0",
  },
  photoIcon: {
    marginRight: theme.spacing(2),
  },
}));

const TextEditor = (props) => {
  const [rawContentState, setRawContentState] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const auth = useSelector((state) => state.auth);

  const classes = useStyles();

  const upload = async () => {
    // 1. First upload the cover img
    const formData = new FormData();
    formData.append("file", coverImg);
    const res = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const imgUrl = API_URL + "/public/" + res.data.data.fileName;
    console.log({ imgUrl });
    // 2. Upload title,desc,content,coverImg url to the backend
    await axios.post(
      `${API_URL}/blogs`,
      {
        title,
        description,
        content: rawContentState,
        coverImg: imgUrl,
        author: auth.user._id,
      },
      {
        "Content-Type": "application/json",
      }
    );
  };

  const getBlog = async () => {
    const res = await axios.get(`${API_URL}/blogs/605ddb451cf6a9dc759d2ac2`);
    const rawContent = res.data.data.blog.content;
    const markup = draftToHtml(rawContent);
    console.log(markup);
  };

  return (
    <>
      <form className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              label="Title"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <input
              onChange={(e) => {
                setCoverImg(e.target.files[0]);
              }}
              className={classes.uploadField}
              type="file"
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <Button
                variant="outlined"
                component="span"
                color="primary"
                size="large"
                fullWidth
                className={classes.uploadButton}
              >
                <PhotoIcon className={classes.photoIcon} />
                {coverImg ? coverImg.name : "Select cover photo"}
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              variant="outlined"
              label="Description"
            />
          </Grid>
        </Grid>
      </form>
      <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        editorStyle={{
          width: "91%",
          border: "1px solid grey",
          padding: "4px",
          margin: "auto",
        }}
        toolbarStyle={{
          width: "90%",
          border: "1px solid grey",
          paddingRight: "7px",
          margin: "3px auto",
        }}
        wrapperStyle={{ margin: "15px" }}
        initialContentState={initialContentState}
        onContentStateChange={(s) => {
          setRawContentState(s);
        }}
        toolbar={{
          image: {
            uploadCallback: uploadImageCallback,
            alt: { present: true, mandatory: false },
          },
        }}
      />
      <Button variant="contained" color="primary" onClick={upload}>
        Upload
      </Button>
      <Button variant="contained" color="primary" onClick={getBlog}>
        GetBlog
      </Button>
    </>
  );
};

export default TextEditor;
