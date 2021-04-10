import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";

import ScheduleIcon from "@material-ui/icons/Schedule";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

const useStyles = makeStyles((theme) => ({
  card: {
    height: 310,
    width: 415,
    [theme.breakpoints.down("xs")]: {
      height: 270,
    },
  },
  title: {
    textAlign: "left",
    overflow: "hidden",
  },
  description: {
    textAlign: "left",
    height: 40,
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
    color: "grey",
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
        <CardContent>
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
        <Typography
          variant="body2"
          style={{ display: "flex", alignItems: "center" }}
        >
          <ScheduleIcon fontSize="small" className={classes.footerIcon} />
          {time}
        </Typography>
        <Typography
          variant="body2"
          style={{ display: "flex", alignItems: "center" }}
        >
          <ThumbUpIcon fontSize="small" className={classes.footerIcon} />
          {likes}
        </Typography>
        <Typography variant="body2">By {author}</Typography>
      </CardContent>
    </Card>
  );
}
