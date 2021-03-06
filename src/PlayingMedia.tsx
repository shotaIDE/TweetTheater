import { Box, Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import React from "react";

import { Tweet } from "./TweetCardList";
import { TweetDetailCard } from "./TweetDetailCard";
import { TweetDetailEmptyCard } from "./TweetDetailEmptyCard";
import { TweetSkeletonCard } from "./TweetSkeletonCard";
import { Video } from "./Video";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
    },
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
      marginBottom: theme.spacing(1),
      justifyContent: "flex-end",
    },
  })
);

interface PlayingMediaDesktopProps {
  fetching: boolean;
  tweet: Tweet;
  favoriteEnabled: boolean;
  favorited: boolean;
  onVideoEnded: () => void;
  handleAddFavorite: () => void;
}

export const PlayingMediaDesktop = (props: PlayingMediaDesktopProps) => (
  <PlayingMedia
    fetching={props.fetching}
    tweet={props.tweet}
    favoriteEnabled={props.favoriteEnabled}
    favorited={props.favorited}
    onVideoEnded={props.onVideoEnded}
    handleAddFavorite={props.handleAddFavorite}
    handleOpenList={null}
  />
);

interface PlayingMediaMobileProps {
  fetching: boolean;
  tweet: Tweet;
  favoriteEnabled: boolean;
  favorited: boolean;
  onVideoEnded: () => void;
  handleAddFavorite: () => void;
  handleOpenList: () => void;
}

export const PlayingMediaMobile = (props: PlayingMediaMobileProps) => (
  <PlayingMedia
    fetching={props.fetching}
    tweet={props.tweet}
    favoriteEnabled={props.favoriteEnabled}
    favorited={props.favorited}
    onVideoEnded={props.onVideoEnded}
    handleAddFavorite={props.handleAddFavorite}
    handleOpenList={props.handleOpenList}
  />
);

interface PlayingMediaProps {
  fetching: boolean;
  tweet: Tweet;
  favoriteEnabled: boolean;
  favorited: boolean;
  onVideoEnded: () => void;
  handleAddFavorite: () => void;
  handleOpenList?: () => void;
}

const PlayingMedia = (props: PlayingMediaProps) => {
  const classes = useStyles(props);

  const videoUrl = props.tweet ? props.tweet.videoUrl : "";
  const tweetDetailCard = props.tweet ? (
    <TweetDetailCard
      tweet={props.tweet}
      favoriteEnabled={props.favoriteEnabled}
      favorited={props.favorited}
      handleAddFavorite={props.handleAddFavorite}
    />
  ) : props.fetching ? (
    <TweetSkeletonCard />
  ) : (
    <TweetDetailEmptyCard />
  );

  const hasOpenListAction = props.handleOpenList != null;

  const openListButton = hasOpenListAction ? (
    <Box className={classes.listButtonBox}>
      <Button
        variant="outlined"
        size="large"
        endIcon={<LibraryBooksIcon />}
        onClick={props.handleOpenList}
      >
        ツイート一覧を開く
      </Button>
    </Box>
  ) : null;

  return (
    <Grid className={classes.root} container spacing={1} direction="row">
      <Grid item xs={12}>
        <Video src={videoUrl} onEnded={props.onVideoEnded} />
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.tweetBox}>
          <Box>
            {tweetDetailCard}
            {openListButton}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
