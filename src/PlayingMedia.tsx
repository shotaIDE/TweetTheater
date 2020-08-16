import { Grid } from "@material-ui/core";
import React from "react";

import { Tweet } from "./TweetCardList";
import { TweetDetailCard } from "./TweetDetailCard";
import { TweetDetailEmptyCard } from "./TweetDetailEmptyCard";
import { Video } from "./Video";

interface Props {
  tweet: Tweet;
  favoriteEnabled: boolean;
  favorited: boolean;
  onEnded: () => void;
  onFavorited: () => void;
}

export const PlayingMedia = (props: Props) => {
  const videoUrl = props.tweet ? props.tweet.videoUrl : "";
  const tweetDetailCard = props.tweet ? (
    <TweetDetailCard
      tweet={props.tweet}
      favoriteEnabled={props.favoriteEnabled}
      favorited={props.favorited}
      onClick={props.onFavorited}
    />
  ) : (
    <TweetDetailEmptyCard />
  );

  return (
    <Grid
      container
      spacing={2}
      direction="row"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}>
        <Video src={videoUrl} onEnded={props.onEnded} />
        {tweetDetailCard}
      </Grid>
    </Grid>
  );
};
