import { Link } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { Tweet } from "./TweetCardList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
      backgroundColor: theme.palette.background.paper,
    },
    datetime: {
      paddingTop: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
    link: {
      paddingTop: theme.spacing(1),
    },
  })
);

interface Props {
  tweet: Tweet;
}

export const TweetDetailCard = (props: Props) => {
  const classes = useStyles(props);

  const tweet = props.tweet;

  const profileImage = (
    <img
      alt={`${tweet.userDisplayName} のプロフィール画像`}
      src={tweet.userProfileImageUrl}
    />
  );

  return (
    <Card key={tweet.detailUrl} className={classes.root}>
      <CardHeader
        align="left"
        avatar={profileImage}
        title={tweet.userDisplayName}
        subheader={`@${tweet.userName}`}
      />
      <CardContent>
        <Typography align="left" variant="body2" component="p">
          {tweet.text}
        </Typography>
        <Typography
          className={classes.datetime}
          align="left"
          variant="body2"
          component="p"
        >
          {tweet.createdAt}
        </Typography>
        <Typography
          className={classes.link}
          align="left"
          variant="body2"
          component="p"
        >
          <Link
            href={tweet.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tweet.detailUrl}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};