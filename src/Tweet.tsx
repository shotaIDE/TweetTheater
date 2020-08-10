import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    backgroundColor: "white",
  },
  rootPlaying: {
    maxWidth: 600,
    backgroundColor: "red",
  },
  rootPlayed: {
    maxWidth: 600,
    backgroundColor: "gray",
  },
}));

export type TweetStatus = "none" | "playing" | "played";

export interface Tweet {
  userName: string;
  userDisplayName: string;
  userProfileImageUrl: string;
  detailUrl: string;
  text: string;
  createdAt: string;
}

interface Props {
  tweet: Tweet;
  status: TweetStatus;
  onClick: any;
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
        <Typography
          align="left"
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {tweet.text}
        </Typography>
        <Typography
          align="left"
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {tweet.createdAt}
        </Typography>
        <Typography
          align="left"
          variant="body2"
          color="textSecondary"
          component="p"
        >
          <a href={tweet.detailUrl} target="_blank" rel="noopener noreferrer">
            {tweet.detailUrl}
          </a>
        </Typography>
      </CardContent>
    </Card>
  );
};
