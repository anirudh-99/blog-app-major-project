import React, { useState } from "react";
import {
  TextField,
  makeStyles,
  Container,
  Button,
  Typography,
  Paper,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../redux/actions/index";

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

export default function Signup() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const userSignup = (e) => {
    e.preventDefault();
    dispatch(signup({ name, email, password }));
    history.push("/login");
  };

  return (
    <Container className={classes.container} maxWidth="xs">
      <Paper variant="outlined" className={classes.paper}>
        <Typography className={classes.heading} variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={userSignup}>
          <TextField
            margin="normal"
            variant="outlined"
            label="Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            variant="outlined"
            label="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            variant="outlined"
            label="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            size="large"
            className={classes.submitButton}
            variant="contained"
            color="primary"
            onClick={userSignup}
          >
            Sign up
          </Button>
          <Link style={{ textAlign: "right", marginTop: "8px" }} to="/login">
            Already created an account? Sign In.
          </Link>
        </form>
      </Paper>
    </Container>
  );
}
