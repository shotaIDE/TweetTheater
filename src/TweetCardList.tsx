import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

import { TweetCard, TweetStatus } from "./TweetCard";
import { TweetSkeletonCard } from "./TweetSkeletonCard";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 600,
    backgroundColor: "white",
  },
}));

export interface TweetCardInfo {
  tweet: Tweet;
  status: TweetStatus;
}

export interface Tweet {
  userName: string;
  userDisplayName: string;
  userProfileImageUrl: string;
  detailUrl: string;
  text: string;
  createdAt: string;
}

interface Props {
  tweetList: TweetCardInfo[];
  onClick: (_: number) => void;
}

export const TweetCardList = (props: Props) => {
  const classes = useStyles(props);

  const result =
    props.tweetList.length > 0
      ? props.tweetList.map((info, id) => {
          return (
            <Grid item key={info.tweet.detailUrl} sm={12}>
              <TweetCard
                tweet={info.tweet}
                status={info.status}
                onClick={() => props.onClick(id)}
              />
            </Grid>
          );
        })
      : Array(5)
          .fill(0)
          .map((_, id) => {
            return (
              <Grid item key={id} sm={12}>
                <TweetSkeletonCard />
              </Grid>
            );
          });

  return (
    <Grid container className={classes.root} spacing={1}>
      {result}
    </Grid>
  );
};
