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
      cursor: "pointer",
    },
    rootPlaying: {
      maxWidth: 600,
      backgroundColor: theme.palette.secondary.dark,
    },
    rootPlayed: {
      maxWidth: 600,
      backgroundColor: theme.palette.action.disabled,
      cursor: "pointer",
    },
  })
);

export type TweetStatus = "none" | "playing" | "played";

interface Props {
  tweet: Tweet;
  status: TweetStatus;
  onClick: () => void;
}

export const TweetCard = (props: Props) => {
  const classes = useStyles(props);

  const tweet = props.tweet;

  const rootStyle =
    props.status === "none"
      ? classes.root
      : props.status === "playing"
      ? classes.rootPlaying
      : classes.rootPlayed;

  const profileImage = (
    <img
      alt={`${tweet.userDisplayName} のプロフィール画像`}
      src={tweet.userProfileImageUrl}
    />
  );

  return (
    <Card key={tweet.detailUrl} className={rootStyle} onClick={props.onClick}>
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
        <Typography align="left" variant="body2" component="p">
          {tweet.createdAt}
        </Typography>
        <Typography align="left" variant="body2" component="p">
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
