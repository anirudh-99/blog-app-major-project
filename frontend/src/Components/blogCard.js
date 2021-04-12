import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";

import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";

const useStyles = makeStyles((theme) => ({
  card: {
    height: 325,
    width: 415,
    [theme.breakpoints.down("xs")]: {
      height: 285,
    },
  },
  title: {
    textAlign: "left",
    overflow: "hidden",
  },
  cardContent: {
    height: 100,
    overflow: "hidden",
  },
  description: {
    textAlign: "left",
    overflow: "hidden",
  },
  media: {
    height: 140,
    [theme.breakpoints.down("xs")]: {
      height: 100,
    },
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "grey",
    height: 15
  },
  cardFooterLeft: {
    display: "flex",
    "& > *": {
      margin: "0 4px",
    },
  },
  footerIcon: {
    marginRight: "5px",
  },
}));

export default function BlogCard({
  coverImg,
  title,
  description,
  id,
  time,
  author,
  likes,
}) {
  const classes = useStyles();
  const history = useHistory();

  const handleClick = (e) => {
    history.push(`/blogs/${id}`);
  };

  return (
    <Card raised className={classes.card} fullWidth>
      <CardActionArea onClick={handleClick}>
        <CardMedia className={classes.media} image={coverImg} />
        <CardContent className={classes.cardContent}>
          <Typography
            className={classes.title}
            gutterBottom
            variant="h6"
            component="h6"
          >
            {title}
          </Typography>
          <Typography
            className={classes.description}
            variant="body2"
            color="textSecondary"
            component="p"
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Divider />
      <CardContent className={classes.cardFooter}>
        <div className={classes.cardFooterLeft}>
          <Typography
            variant="body2"
            style={{ display: "flex", alignItems: "center" }}
          >
            {time}
          </Typography>
          ·
          <Typography
            variant="body2"
            style={{ display: "flex", alignItems: "center" }}
          >
            {likes} likes
          </Typography>
          ·<Typography variant="body2">{author}</Typography>
        </div>
        <IconButton>
          <BookmarkBorderIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
