import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "700px",
    justifyContent: "space-between",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
    width: "500px",
  },
  cover: {
    width: 200,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function BookmarkCard({
  title,
  description,
  coverImg,
  blogId,
  id,
  deleteHandler
}) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardActionArea onClick={() => history.push(`/blogs/${blogId}`)}>
          <CardContent
            className={classes.content}
          >
            <Typography component="h5" variant="h5">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <div className={classes.controls}>
          <IconButton onClick={() => deleteHandler(id)}>
            <HighlightOffIcon style={{ color: "red" }} />
          </IconButton>
        </div>
      </div>
      <CardMedia className={classes.cover} image={coverImg} />
    </Card>
  );
}
