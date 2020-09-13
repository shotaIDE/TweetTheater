import { Grid, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { TweetCard, TweetStatus } from "./TweetCard";
import { TweetSkeletonCard } from "./TweetSkeletonCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
    },
    explanation: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
);

export interface Tweet {
  id: string;
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
  fetchError: boolean;
  handleSelectTweet: (_: number) => void;
}

export const TweetCardList = (props: Props) => {
  const classes = useStyles(props);

  if (props.fetchError) {
    return null;
  }

  const numTweet = props.tweetList.length;

  const explanation =
    numTweet > 0 ? (
      <Typography
        className={classes.explanation}
        variant="body2"
        color="textSecondary"
      >
        新しく投稿された順に {numTweet}件 のツイートを表示しています。
      </Typography>
    ) : null;

  const cardList =
    numTweet > 0
      ? props.tweetList.map((tweet, id) => {
          return (
            <Grid item key={tweet.detailUrl} sm={12}>
              <TweetCard
                serialNumber={id + 1}
                tweet={tweet}
                status={props.statusList[id]}
                handleClick={() => props.handleSelectTweet(id)}
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
      {explanation}
      {cardList}
    </Grid>
  );
};
