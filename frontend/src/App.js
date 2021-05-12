import "./App.css";
import Home from "./pages/home";
import WriteBlog from "./pages/writeBlog";
import UpdateBlog from './pages/updateBlog';
import Header from "./Components/header";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Bookmarks from "./pages/bookmarks/bookmarks";
import Blog from "./pages/blog/blog";
import Profile from "./pages/profile";
import PrivateRoute from "./Components/hoc/privateRoutes";
import { API_URL } from "./constants";
import { isUserLoggedIn } from "./redux/actions/index";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      dispatch(isUserLoggedIn());
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <PrivateRoute exact={true} path="/" component={Home} />
          <PrivateRoute path="/writeBlog" component={WriteBlog} />
          <PrivateRoute path="/updateBlog/:blogId" component={UpdateBlog} />
          <PrivateRoute path="/blogs/:id" component={Blog} />
          <PrivateRoute path="/bookmarks" component={Bookmarks} />
          <PrivateRoute path="/profile/:userId" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
