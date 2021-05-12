import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: 5
  },
  title: {
    fontSize: 14,
  },
});

export default function ProfileCommentCard({
  id,
  time,
  commentContent,
  blogId,
}) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Card className={classes.root} variant="outlined">
      <CardActionArea onClick={() => history.push(`/blogs/${blogId}#comments`)}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {time}
          </Typography>
          <Typography variant="body2" component="p">
            {commentContent}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <Button size="small">Edit</Button>
      </CardActions> */}
    </Card>
  );
}
