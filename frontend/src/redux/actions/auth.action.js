import { authConstants } from "./constants";
import { API_URL } from "../../constants";
import axios from "../../axios";

export const login = (user) => async (dispatch) => {
  dispatch({ type: authConstants.LOGIN_REQUEST });
  try {
    const res = await axios.post("/auth/login", user);

    const token = res.data.token;
    user = res.data.data.user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: authConstants.LOGIN_SUCCESS,
      payload: {
        token,
        user,
      },
    });
  } catch (err) {
    console.log(err.response);
    dispatch({
      type: authConstants.LOGIN_FAILURE,
      payload: {
        error: err.response?.data?.message,
      },
    });
  }
};

export const signout = () => async (dispatch) => {
  dispatch({ type: authConstants.LOGIN_REQUEST });
  try {
    localStorage.clear();
    dispatch({ type: authConstants.LOGOUT_SUCCESS });
  } catch (err) {
    dispatch({
      type: authConstants.LOGOUT_FAILURE,
      payload: { error: "error while logging out" },
    });
  }
};

export const isUserLoggedIn = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    dispatch({
      type: authConstants.LOGIN_SUCCESS,
      payload: {
        token,
        user,
      },
    });
  } else {
    
    dispatch({
      type: authConstants.LOGIN_FAILURE,
      payload: { error: "failed to login" },
    });
  }
};
