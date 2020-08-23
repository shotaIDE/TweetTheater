import { Box, Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import React from "react";

import { Tweet } from "./TweetCardList";
import { TweetDetailCard } from "./TweetDetailCard";
import { TweetDetailEmptyCard } from "./TweetDetailEmptyCard";
import { Video } from "./Video";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tweetBox: {
      display: "flex",
      width: "100%",
      marginBottom: theme.spacing(1),
      justifyContent: "center",
    },
    listButtonBox: {
      display: "flex",
      width: "100%",
      marginTop: theme.spacing(1),
      justifyContent: "flex-end",
    },
  })
);

interface Props {
  tweet: Tweet;
  favoriteEnabled: boolean;
  favorited: boolean;
  onEnded: () => void;
  onFavorited: () => void;
  onOpenList: () => void;
}

export const PlayingMedia = (props: Props) => {
  const classes = useStyles(props);

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
    <Grid container spacing={1} direction="row">
      <Grid item xs={12}>
        <Video src={videoUrl} onEnded={props.onEnded} />
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.tweetBox}>
          <Box>
            {tweetDetailCard}
            <Box className={classes.listButtonBox}>
              <Button
                variant="outlined"
                endIcon={<LibraryBooksIcon />}
                onClick={props.onOpenList}
              >
                ツイート一覧を開く
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
