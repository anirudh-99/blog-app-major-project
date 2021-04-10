import "./App.css";
import Home from "./pages/home";
import TextEditor from "./pages/textEditor";
import Header from "./Components/header";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Blog from './pages/blog';
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
          <PrivateRoute path="/writeBlog" component={TextEditor} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/blogs/:id" component={Blog}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
