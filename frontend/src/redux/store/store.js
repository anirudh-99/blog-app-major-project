import { createStore, applyMiddleware } from "redux";
//import root reducer
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import * as actions from "../actions/index";
import rootReducer from "../reducers/rootReducer";

const composeEnhancers = composeWithDevTools({
  actions,
  trace: true,
  traceLimit: 50,
});

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
