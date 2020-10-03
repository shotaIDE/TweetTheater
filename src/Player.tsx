import "./App.css";

import { Container, Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect, useMemo, useState } from "react";

import { SigninStatus } from "./App";
import { ErrorSnackbar } from "./ErrorSnackbar";
import { FavoriteResult, FavoriteSnackbars } from "./FavoriteSnackbars";
import { Loading } from "./Loading";
import { NeedSignin } from "./NeedSignin";
import { PlayingMediaDesktop, PlayingMediaMobile } from "./PlayingMedia";
import { TweetStatus } from "./TweetCard";
import { Tweet, TweetCardList } from "./TweetCardList";
import { getTweetList } from "./TweetList";
import { TweetListDialog } from "./TweetListDialog";

const favoriteEnabled = process.env.REACT_APP_FAVORITE === "enabled";

type FetchStatus = "notStarted" | "inProcess" | "done";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fixedContainer: {
      position: "fixed",
      left: "51%",
      top: "12%",
      display: "flex",
      justifyContent: "center",
      [theme.breakpoints.up("md")]: {
        width: 450,
      },
      [theme.breakpoints.up("lg")]: {
        width: 600,
      },
    },
  })
);

interface Props {
  isDesktop: boolean;
  signinStatus: SigninStatus;
  userName: string;
  idToken: string;
  uid: string;
  accessToken: string;
  secret: string;
  handleSignin: () => void;
  handleChangePosition: (title: string) => void;
}

export const Player = (props: Props) => {
  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [favoritedList, setFavoritedList] = useState<boolean[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("notStarted");
  const [fetchError, setFetchError] = useState(false);
  const [playedList, setPlayedList] = useState([]);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [favoriteSnackbarOpen, setFavoriteSnackbarOpen] = useState<
    FavoriteResult
  >(null);
  const [listOpen, setListOpen] = useState(false);

  const authParamerters = useMemo(() => {
    const params =
      props.idToken == null
        ? null
        : props.accessToken != null && props.secret != null
        ? {
            idToken: props.idToken,
            accessToken: props.accessToken,
            secret: props.secret,
          }
        : {
            idToken: props.idToken,
          };

    return params;
  }, [props.accessToken, props.idToken, props.secret]);

  useEffect(() => {
    if (authParamerters == null) {
      return;
    }

    if (fetchStatus !== "notStarted") {
      // サインインのリダイレクト後に、idToken と accessToken 等が別々に更新されるため、
      // その際に二重にフェッチが実行されることを防止する
      return;
    }

    setFetchStatus("inProcess");

    const fetchUrl = `${process.env.REACT_APP_API_ORIGIN}/api/search/`;

    fetch(fetchUrl, {
      mode: "cors",
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.keys(authParamerters)
        .map((key) => `${key}=${encodeURIComponent(authParamerters[key])}`)
        .join("&"),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const fetchedTweetList = getTweetList(json);

        setFetchStatus("done");
        setPlayedList(Array(fetchedTweetList.length).fill(false));
        setTweetList(fetchedTweetList);
        setFavoritedList(Array(fetchedTweetList.length).fill(false));
      })
      .catch((_) => {
        setFetchStatus("done");
        setFetchError(true);
        setErrorSnackbarOpen(true);
      });
  }, [fetchStatus, authParamerters]);

  const classes = useStyles(props);

  // 一つの動画の再生が完了した場合
  const onVideoEnded = () => {
    let updatedPlayedList = playedList;
    updatedPlayedList[currentVideoId] = true;
    setPlayedList(updatedPlayedList);

    const nextVideoId = currentVideoId + 1;
    if (nextVideoId >= tweetList.length) {
      setCurrentVideoId(-1);
      return;
    }

    setCurrentVideoId(nextVideoId);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const handleCloseFavoriteSnackbars = () => {
    setFavoriteSnackbarOpen(null);
  };

  const handleAddFavorite = () => {
    const targetId = tweetList[currentVideoId].id;

    const postUrl = `${process.env.REACT_APP_API_ORIGIN}/api/favorite/create`;

    const params = authParamerters;
    params["id"] = targetId;

    // いいねボタンを無効化し、多重にリクエストするのを防ぐ
    let updatedFavoriteList = favoritedList.slice(); // コピー
    updatedFavoriteList[currentVideoId] = true;
    setFavoritedList(updatedFavoriteList);

    fetch(postUrl, {
      mode: "cors",
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&"),
    })
      .then((response) => {
        if (!response.ok) {
          // catch 節に制御を移す
          throw new Error();
        }

        return response.json();
      })
      .then((json) => {
        if (json["code"] === 139) {
          setFavoriteSnackbarOpen("already favorited");
          return;
        }

        setFavoriteSnackbarOpen("succeed");
      })
      .catch((_) => {
        setFavoriteSnackbarOpen("unknown error");

        // 再度クリックできるようにする
        let updatedFavoriteList = favoritedList.slice(); // コピー
        updatedFavoriteList[currentVideoId] = false;
        setFavoritedList(updatedFavoriteList);
        return;
      });
  };

  const handleSelectTweet = (id: number) => {
    if (listOpen) {
      handleCloseList();
    }

    setCurrentVideoId(id);
  };

  const handleOpenList = () => {
    setListOpen(true);
  };

  const handleCloseList = () => {
    setListOpen(false);
  };

  const tweetCardInfoList = tweetList.map(
    (_, id): TweetStatus =>
      id === currentVideoId ? "playing" : playedList[id] ? "played" : "none"
  );

  const isPlayingVideo =
    currentVideoId >= 0 && currentVideoId < tweetList.length;
  const currentTweet = isPlayingVideo ? tweetList[currentVideoId] : null;
  const currentFavorited = isPlayingVideo
    ? favoritedList[currentVideoId]
    : false;

  useEffect(() => {
    const position = `${isPlayingVideo ? currentVideoId + 1 : "-"} / ${
      tweetList.length
    }`;
    props.handleChangePosition(position);
  }, [currentVideoId, isPlayingVideo, props, tweetList.length]);

  const fetching = fetchStatus === "inProcess";

  const mainContainer =
    props.signinStatus === "signined" ? (
      props.isDesktop ? (
        <Container fixed={true}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TweetCardList
                tweetList={tweetList}
                statusList={tweetCardInfoList}
                fetchError={fetchError}
                handleSelectTweet={handleSelectTweet}
              />
            </Grid>
            <Grid item xs={6}></Grid>
            <div className={classes.fixedContainer}>
              <PlayingMediaDesktop
                fetching={fetching}
                tweet={currentTweet}
                favoriteEnabled={favoriteEnabled}
                favorited={currentFavorited}
                onVideoEnded={onVideoEnded}
                handleAddFavorite={handleAddFavorite}
              />
            </div>
          </Grid>
        </Container>
      ) : (
        <Container>
          <PlayingMediaMobile
            fetching={fetching}
            tweet={currentTweet}
            favoriteEnabled={favoriteEnabled}
            favorited={currentFavorited}
            onVideoEnded={onVideoEnded}
            handleAddFavorite={handleAddFavorite}
            handleOpenList={handleOpenList}
          />
          <TweetListDialog
            open={listOpen}
            tweetList={tweetList}
            statusList={tweetCardInfoList}
            fetchError={fetchError}
            handleClose={handleCloseList}
            handleSelectTweet={handleSelectTweet}
          />
        </Container>
      )
    ) : props.signinStatus === "notSignined" ? (
      <NeedSignin
        favoriteEnabled={favoriteEnabled}
        handleSignin={props.handleSignin}
      />
    ) : (
      <Loading />
    );

  return (
    <div>
      {mainContainer}
      <ErrorSnackbar
        open={errorSnackbarOpen}
        handleClose={handleCloseErrorSnackbar}
      />
      <FavoriteSnackbars
        open={favoriteSnackbarOpen}
        handleClose={handleCloseFavoriteSnackbars}
      />
    </div>
  );
};
