import { Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { TweetCard, TweetStatus } from "./TweetCard";
import { TweetSkeletonCard } from "./TweetSkeletonCard";

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
    },
  })
);

export interface Tweet {
  userName: string;
  userDisplayName: string;
  userProfileImageUrl: string;
  detailUrl: string;
  text: string;
  createdAt: string;
  videoUrl: string;
}

interface Props {
  tweetList: Tweet[];
  statusList: TweetStatus[];
  onClick: (_: number) => void;
}

export const TweetCardList = (props: Props) => {
  const classes = useStyles(props);

  const result =
    props.tweetList.length > 0
      ? props.tweetList.map((tweet, id) => {
          return (
            <Grid item key={tweet.detailUrl} sm={12}>
              <TweetCard
                tweet={tweet}
                status={props.statusList[id]}
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
