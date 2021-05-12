import { userConstants } from "./constants";
import { API_URL } from "../../constants";
import axios from "../../axios";

export const signup = (user) => {
  return async (dispatch) => {
    dispatch({ type: userConstants.USER_REGISTER_REQUEST });
    try {
      const res = await axios.post("/auth/signup", { ...user });
      dispatch({
        type: userConstants.USER_REGISTER_SUCCESS,
        payload: { message: res.data.message },
      });
    } catch (err) {
      dispatch({
        type: userConstants.USER_REGISTER_FAILURE,
        payload: { error: err.response.data.message },
      });
    }
  };
};
