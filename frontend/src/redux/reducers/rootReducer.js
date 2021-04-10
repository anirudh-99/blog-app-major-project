import authReducer from "./authReducer";
import userReducer from "./userReducer";
import blogsReducer from "./blogsReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  blogs: blogsReducer,
});

export default rootReducer;
