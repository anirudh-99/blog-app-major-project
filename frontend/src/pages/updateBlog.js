import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { API_URL } from "../constants";
import { makeStyles, Grid, TextField, Button } from "@material-ui/core";
import { Photo as PhotoIcon, Save as SaveIcon } from "@material-ui/icons";

import axios from "../axios";
import { useSelector } from "react-redux";

const uploadImageCallback = (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("/files/upload", formData, {
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
  uploadCoverButton: {
    padding: "13px 0",
  },
  uploadButton: {
    width: "30%",
    margin: "20px 30%",
  },
  photoIcon: {
    marginRight: theme.spacing(2),
  },
}));

const TextEditor = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const auth = useSelector((state) => state.auth);
  const { blogId } = useParams();

  const classes = useStyles();

  useEffect(() => {
    async function fetchBlogData() {
      try {
        let res = await axios.get(`/blogs/${blogId}`);
        const blogData = res.data.data.blog;
        setTitle(blogData.title);
        setDescription(blogData.description);
        if(!blogData.content.entityMap){
          blogData.content.entityMap = {};
        }
        console.log(blogData.content);
        setEditorState(
          EditorState.createWithContent(convertFromRaw(blogData.content))
        );
        console.log(editorState);
        console.log("hello");
      } catch (err) {
        //todo: handle error
        console.log(err);
      }
    }
    fetchBlogData();
  }, []);

  const saveData = async () => {
    try {
      let imgUrl = undefined;
      //if the cover img is updated in upload that image first
      if (coverImg) {
        // First upload the cover img
        const formData = new FormData();
        formData.append("file", coverImg);
        const res = await axios.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imgUrl = API_URL + "/public/" + res.data.data.fileName;
      }

      // Upload title,desc,content,coverImg url to the backend
      const res = await axios.patch(
        `/blogs/${blogId}`,
        {
          title,
          description,
          content: convertToRaw(editorState.getCurrentContent()),
          coverImg: imgUrl,
        },
        {
          "Content-Type": "application/json",
        }
      );
      //todo: display message
    } catch (err) {
      //todo: handle error
      console.log(err.response);
    } finally {
      window.location.reload();
    }
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
                className={classes.uploadCoverButton}
              >
                <PhotoIcon className={classes.photoIcon} />
                {coverImg ? coverImg.name : "Change cover photo"}
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
        editorState={editorState}
        onEditorStateChange={(s) => {
          setEditorState(s);
        }}
        toolbar={{
          image: {
            uploadCallback: uploadImageCallback,
            alt: { present: true, mandatory: false },
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={saveData}
        className={classes.uploadButton}
      >
        <SaveIcon />
        Save
      </Button>
    </>
  );
};

export default TextEditor;
