import "./App.css";
import Home from "./Components/home";
import TextEditor from "./Components/textEditor";
import Header from "./Components/header";
import Login from "./Components/login";
import PrivateRoute from "./Components/hoc/privateRoutes";
import { API_URL } from "./constants";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <PrivateRoute exact path="/writeBlog">
            <TextEditor />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
