import "./App.css";

import { Container, Grid } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";

import { SigninStatus } from "./App";
import { ErrorSnackbar } from "./ErrorSnackbar";
import { FavoriteResult, FavoriteSnackbars } from "./FavoriteSnackbars";
import { Loading } from "./Loading";
import { NeedSignin } from "./NeedSignin";
import { PlayingMedia } from "./PlayingMedia";
import { TweetStatus } from "./TweetCard";
import { Tweet, TweetCardList } from "./TweetCardList";
import { getTweetList } from "./TweetList";

const favoriteEnabled = true;

interface Props {
  signinStatus: SigninStatus;
  userName: string;
  idToken: string;
  uid: string;
  accessToken: string;
  secret: string;
  handleSignin: () => void;
  titleSuffixDidChange: (title: string) => void;
}

export const Player = (props: Props) => {
  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [favoritedList, setFavoritedList] = useState<boolean[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [fetchRequested, setFetchRequested] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [playedList, setPlayedList] = useState([]);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [favoriteSnackbarOpen, setFavoriteSnackbarOpen] = useState<
    FavoriteResult
  >(null);

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

    if (fetchRequested) {
      // サインインのリダイレクト後に、idToken と accessToken 等が別々に更新されるため、
      // その際に二重にフェッチが実行されることを防止する
      return;
    }

    setFetchRequested(true);

    const fetchUrl = `${process.env.REACT_APP_API_ORIGIN}/api/search/`;

    fetch(fetchUrl, {
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

        setPlayedList(Array(fetchedTweetList.length).fill(false));
        setTweetList(fetchedTweetList);
        setFavoritedList(Array(fetchedTweetList.length).fill(false));
      })
      .catch((_) => {
        setFetchError(true);
        setErrorSnackbarOpen(true);
      });
  }, [fetchRequested, authParamerters]);

  // 一つの動画の再生が完了した場合
  const onEnded = () => {
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

  const handleErrorSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };

  const handleFavoriteSnackbarsClose = () => {
    setFavoriteSnackbarOpen(null);
  };

  const onFavorited = () => {
    const targetId = tweetList[currentVideoId].id;

    const postUrl = `${process.env.REACT_APP_API_ORIGIN}/api/favorite/create`;

    const params = authParamerters;
    params["id"] = targetId;

    // いいねボタンを無効化し、多重にリクエストするのを防ぐ
    let updatedFavoriteList = favoritedList.slice(); // コピー
    updatedFavoriteList[currentVideoId] = true;
    setFavoritedList(updatedFavoriteList);

    fetch(postUrl, {
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

  const onClick = (id: number) => {
    setCurrentVideoId(id);
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
    const currentPosition = ` - [ ${
      isPlayingVideo ? currentVideoId + 1 : "-"
    } / ${tweetList.length} ]`;
    props.titleSuffixDidChange(currentPosition);
  }, [currentVideoId, isPlayingVideo, props, tweetList.length]);

  const mainContainer =
    props.signinStatus === "signined" ? (
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TweetCardList
              tweetList={tweetList}
              statusList={tweetCardInfoList}
              fetchError={fetchError}
              onClick={onClick}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <div
            style={{
              position: "fixed",
              left: "51%",
              width: 600,
              height: "90%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PlayingMedia
              tweet={currentTweet}
              favoriteEnabled={favoriteEnabled}
              favorited={currentFavorited}
              onEnded={onEnded}
              onFavorited={onFavorited}
            />
          </div>
        </Grid>
      </Container>
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
        handleClose={handleErrorSnackbarClose}
      />
      <FavoriteSnackbars
        open={favoriteSnackbarOpen}
        handleClose={handleFavoriteSnackbarsClose}
      />
    </div>
  );
};
