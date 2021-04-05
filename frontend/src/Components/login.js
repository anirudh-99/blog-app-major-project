import React from "react";
import {
  TextField,
  makeStyles,
  Container,
  Button,
  Typography,
  Paper,
} from "@material-ui/core";
import { Link } from "react-router-dom";

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
  return (
    <Container className={classes.container} maxWidth="xs">
      <Paper variant="outlined" className={classes.paper}>
        <Typography className={classes.heading} variant="h5">
          Sign In
        </Typography>
        <form className={classes.form}>
          <TextField margin="normal" variant="outlined" label="Username*" />
          <TextField margin="normal" variant="outlined" label="Password*" />
          <Button
            size="large"
            className={classes.submitButton}
            variant="contained"
            color="primary"
          >
            Sign in
          </Button>
          <Link style={{ textAlign: "right",marginTop:"8px" }} to="/signup">
            Don't have an account? Sign up.
          </Link>
        </form>
      </Paper>
    </Container>
  );
}
