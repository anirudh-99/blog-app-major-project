import { blogConstants } from "../actions/constants";

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case blogConstants.GET_BLOGS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case blogConstants.GET_BLOGS_SUCCESS:
      state = {
        ...state,
        blogs: action.payload.blogs,
        loading: false,
      };
      break;
    case blogConstants.GET_BLOGS_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
