import { blogConstants } from "./constants";
import { API_URL } from "../../constants";
import axios from "../../axios";

export const getBlogs = () => async (dispatch) => {
  dispatch({ type: blogConstants.GET_BLOGS_REQUEST });
  try {
    const res = await axios.get("/blogs/");
    dispatch({
      type: blogConstants.GET_BLOGS_SUCCESS,
      payload: {
        blogs: res.data.data.blogs,
      },
    });
  } catch (err) {
    console.log(err.response);
    dispatch({
      type: blogConstants.GET_BLOGS_FAILURE,
      payload: {
        error: "failed to fetch blogs",
      },
    });
  }
};
