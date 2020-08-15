import "firebase/auth";
import "firebase/analytics";
import "./App.css";

import { Container, CssBaseline, Grid, ThemeProvider } from "@material-ui/core";
import * as firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import { SigninStatusBar } from "./AppBar";
import { darkTheme } from "./DarkTheme";
import { ErrorSnackbar } from "./ErrorSnackbar";
import { FavoriteResult, FavoriteSnackbars } from "./FavoriteSnackbars";
import { Loading } from "./Loading";
import { NeedSignin } from "./NeedSignin";
import { PlayingMedia } from "./PlayingMedia";
import { TweetStatus } from "./TweetCard";
import { Tweet, TweetCardList } from "./TweetCardList";
import { getTweetList } from "./TweetList";

export type SigninStatus = "unknown" | "signined" | "notSignined";

const firebaseConfig = {
  apiKey: "AIzaSyBnnsai_J9oEmfs4XS8H7FrVzaKmiC_KQM",
  authDomain: "autoplayclient-dev.firebaseapp.com",
  databaseURL: "https://autoplayclient-dev.firebaseio.com",
  projectId: "autoplayclient-dev",
  storageBucket: "autoplayclient-dev.appspot.com",
  messagingSenderId: "793287019774",
  appId: "1:793287019774:web:e9674fb31ca75f3d9a29af",
  measurementId: "G-SQ81DJLTJ6",
};

firebase.initializeApp(firebaseConfig);

if (process.env.REACT_APP_GOOGLE_ANALYTICS === "enabled") {
  firebase.analytics();
}

const provider = new firebase.auth.TwitterAuthProvider();

const getAuthParams = (
  uid: string,
  idToken: string,
  accessToken: string,
  secret: string
) => {
  const params =
    uid != null && accessToken != null && secret != null
      ? {
          uid: uid,
          accessToken: accessToken,
          secret: secret,
        }
      : {
          idToken: idToken,
        };

  return params;
};

const App = () => {
  const [inSignin, setInSignin] = useState(false);
  const [signinStatus, setSigninStatus] = useState<SigninStatus>("unknown");
  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [favoritedList, setFavoritedList] = useState<boolean[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [fetchRequested, setFetchRequested] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [playedList, setPlayedList] = useState([]);
  const [userName, setUserName] = useState(null);
  const [idToken, setIDToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [favoriteSnackbarOpen, setFavoriteSnackbarOpen] = useState<
    FavoriteResult
  >(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setSigninStatus("signined");

        const userName = user.displayName;
        setUserName(userName);

        user.getIdToken().then((fetchedIDToken) => {
          setIDToken(fetchedIDToken);

          console.log(
            `Signined: IDToken=${fetchedIDToken.substring(0, 20)}...`
          );
        });

        return;
      }

      setSigninStatus("notSignined");

      console.log("Not Signined");
    });

    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        const uid = result.user["uid"];
        const accessToken = result.credential["accessToken"];
        const secret = result.credential["secret"];

        setUid(uid);
        setAccessToken(accessToken);
        setSecret(secret);

        if (process.env.REACT_APP_GOOGLE_ANALYTICS === "enabled") {
          // 推奨イベントとしてパラメータの指定が強制されているので、固定値だが指定
          firebase.analytics().logEvent("login", { method: "Twitter" });
        }

        console.log(
          `Signined: UID=${uid.substring(0, 5)}... ` +
            `AccessToken=${accessToken.substring(0, 5)}... ` +
            `Secret=${secret.substring(0, 5)}`
        );

        const fetchUrl = `${process.env.REACT_APP_API_ORIGIN}/fetch/create/`;
        const params = {
          uid: uid,
          accessToken: accessToken,
          secret: secret,
        };

        fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join("&"),
        });
      })
      .catch((error) => {
        console.log("Not redirected");
      });
  }, []);

  useEffect(() => {
    if (
      idToken == null &&
      (uid == null || accessToken == null || secret == null)
    ) {
      return;
    }

    if (fetchRequested) {
      // サインインのリダイレクト後に、idToken と accessToken 等が別々に更新されるため、
      // その際に二重にフェッチが実行されることを防止する
      return;
    }

    setFetchRequested(true);

    const fetchUrl = `${process.env.REACT_APP_API_ORIGIN}/fetch/`;

    const params = getAuthParams(uid, idToken, accessToken, secret);

    fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
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
  }, [accessToken, fetchRequested, idToken, secret, uid]);

  const handleSignin = () => {
    // ボタンクリック後にページ遷移まで時間がかかる場合があるため、
    // 多重にクリックされないようにボタンを無効化する
    setInSignin(true);

    firebase.auth().signInWithRedirect(provider);
  };

  const handleSignout = () => {
    firebase.auth().signOut();
  };

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

    const postUrl = `${process.env.REACT_APP_API_ORIGIN}/fetch/favorite/`;

    const params = getAuthParams(uid, idToken, accessToken, secret);
    params["id"] = targetId;

    // いいねボタンを無効化し、多重にリクエストするのを防ぐ
    let updatedFavoriteList = favoritedList.slice(); // コピー
    updatedFavoriteList[currentVideoId] = true;
    setFavoritedList(updatedFavoriteList);

    if (process.env.REACT_APP_GOOGLE_ANALYTICS === "enabled") {
      firebase.analytics().logEvent("favorite");
    }

    (async () => {
      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&"),
      });

      const responseOk = await response.ok;

      if (!responseOk) {
        setFavoriteSnackbarOpen("unknown error");

        // 再度クリックできるようにする
        let updatedFavoriteList = favoritedList.slice(); // コピー
        updatedFavoriteList[currentVideoId] = false;
        setFavoritedList(updatedFavoriteList);
        return;
      }

      const json = await response.json();

      if (json["code"] === 139) {
        setFavoriteSnackbarOpen("already favorited");
        return;
      }

      setFavoriteSnackbarOpen("succeed");
    })();
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

  const currentPosition = ` - [ ${
    isPlayingVideo ? currentVideoId + 1 : "-"
  } / ${tweetList.length} ]`;

  const mainContainer =
    signinStatus === "signined" ? (
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
              favorited={currentFavorited}
              onEnded={onEnded}
              onFavorited={onFavorited}
            />
          </div>
        </Grid>
      </Container>
    ) : signinStatus === "notSignined" ? (
      <NeedSignin inSignin={inSignin} handleSignin={handleSignin} />
    ) : (
      <Loading />
    );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SigninStatusBar
        titleSuffix={currentPosition}
        inSignin={inSignin}
        signinStatus={signinStatus}
        userName={userName}
        handleSignin={handleSignin}
        handleSignout={handleSignout}
      />
      {mainContainer}
      <ErrorSnackbar
        open={errorSnackbarOpen}
        handleClose={handleErrorSnackbarClose}
      />
      <FavoriteSnackbars
        open={favoriteSnackbarOpen}
        handleClose={handleFavoriteSnackbarsClose}
      />
    </ThemeProvider>
  );
};

export default App;
