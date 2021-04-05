import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = (props) => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
  }, []);
  return (
    <Route {...props}>
      {token ? props.children : <Redirect to={"/login"} />}
    </Route>
  );
};

export default PrivateRoute;
