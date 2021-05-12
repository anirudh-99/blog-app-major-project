import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

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
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "grey",
    height: 15,
  },
  cardFooterLeft: {
    display: "flex",
    "& > *": {
      margin: "0 4px",
    },
  },
}));

export default function HorizontalBlogCard({
  title,
  description,
  coverImg,
  blogId,
  time,
  likes,
  author,
}) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardActionArea onClick={() => history.push(`/blogs/${blogId}`)}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {description}
            </Typography>
          </CardContent>
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
              {author ? (
                <span>
                  ·<Typography variant="body2">{author}</Typography>
                </span>
              ) : null}
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" onClick={() => history.push(`/updateBlog/${blogId}`)}>Edit</Button>
        </CardActions>
      </div>
      <CardMedia className={classes.cover} image={coverImg} />
    </Card>
  );
}
