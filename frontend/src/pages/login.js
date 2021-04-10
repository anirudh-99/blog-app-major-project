import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TextField,
  makeStyles,
  Container,
  Button,
  Typography,
  Paper,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/index";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "bold",
  },
  container: {
    marginTop: "10%",
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  submitButton: {
    marginTop: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useSelector((state) => state.auth);
  const history = useHistory();

  const dispatch = useDispatch();

  // if (auth.isAuthenticated) {
  //   return <Redirect to="/" />;
  // }
  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push("/");
    }
  }, [auth.isAuthenticated]);

  const userLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
    history.push("/");
  };

  return (
    <Container className={classes.container} maxWidth="xs">
      <Paper variant="outlined" className={classes.paper}>
        <Typography className={classes.heading} variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={userLogin}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            label="Email*"
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            label="Password*"
          />
          <Button
            size="large"
            className={classes.submitButton}
            variant="contained"
            color="primary"
            onClick={userLogin}
          >
            Sign in
          </Button>
          <Link style={{ textAlign: "right", marginTop: "8px" }} to="/signup">
            Don't have an account? Sign up.
          </Link>
        </form>
      </Paper>
    </Container>
  );
}
