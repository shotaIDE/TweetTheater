import "firebase/auth";
import "./App.css";

import { Container, CssBaseline, Grid, ThemeProvider } from "@material-ui/core";
import * as firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import { SigninStatusBar } from "./AppBar";
import { darkTheme } from "./DarkTheme";
import { Loading } from "./Loading";
import { NeedSignin } from "./NeedSignin";
import { PlayingMedia } from "./PlayingMedia";
import {
  PostFavoriteResult,
  PostFavoriteSnackbars,
} from "./PostFavoriteSnackbars";
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
// firebase.analytics();

const provider = new firebase.auth.TwitterAuthProvider();

const handleSignin = () => {
  firebase.auth().signInWithRedirect(provider);
};

const handleSignout = () => {
  localStorage.clear();

  firebase.auth().signOut();
};

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
  const [signinStatus, setSigninStatus] = useState<SigninStatus>("unknown");
  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [favoritedList, setFavoritedList] = useState<boolean[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [playedList, setPlayedList] = useState([]);
  const [userName, setUserName] = useState(null);
  const [idToken, setIDToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState<PostFavoriteResult>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setSigninStatus("signined");

        const userName = user.displayName;
        setUserName(userName);

        user.getIdToken().then((fetchedIDToken) => {
          setIDToken(fetchedIDToken);
          console.log(fetchedIDToken);
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

        const fetchUrl = "http://127.0.0.1:8000/fetch/create/";
        const params = {
          uid: uid,
          accessToken: accessToken,
          secret: secret,
        };
        console.log(params);
        fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join("&"),
        }).then((response) => {
          const json = response.json();

          console.log(`Redirect results: ${json}`);
        });
      })
      .catch((error) => {
        console.log(`Auth failed: ${error}`);
      });
  }, []);

  useEffect(() => {
    if (
      idToken == null &&
      (uid == null || accessToken == null || secret == null)
    ) {
      return;
    }

    (async () => {
      const fetchUrl = `http://127.0.0.1:8000/fetch/`;

      const params = getAuthParams(uid, idToken, accessToken, secret);

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&"),
      });
      const json = await response.json();

      const fetchedTweetList = getTweetList(json);

      setPlayedList(Array(fetchedTweetList.length).fill(false));
      setTweetList(fetchedTweetList);
      setFavoritedList(Array(fetchedTweetList.length).fill(false));
    })();
  }, [accessToken, idToken, secret, uid]);

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

    console.log(tweetList[currentVideoId].videoUrl);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(null);
  };

  const onFavorited = () => {
    const targetId = tweetList[currentVideoId].id;

    const postUrl = `http://127.0.0.1:8000/fetch/favorite/`;

    const params = getAuthParams(uid, idToken, accessToken, secret);
    params["id"] = targetId;

    // いいねボタンを無効化し、多重にリクエストするのを防ぐ
    let updatedFavoriteList = favoritedList.slice(); // コピー
    updatedFavoriteList[currentVideoId] = true;
    setFavoritedList(updatedFavoriteList);

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
        setSnackbarOpen("unknown error");

        // 再度クリックできるようにする
        let updatedFavoriteList = favoritedList.slice(); // コピー
        updatedFavoriteList[currentVideoId] = false;
        setFavoritedList(updatedFavoriteList);
        return;
      }

      const json = await response.json();

      if (json["code"] === 139) {
        setSnackbarOpen("already favorited");
        return;
      }

      setSnackbarOpen("succeed");
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
      <NeedSignin handleSignin={handleSignin} />
    ) : (
      <Loading />
    );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SigninStatusBar
        titleSuffix={currentPosition}
        signinStatus={signinStatus}
        userName={userName}
        handleSignin={handleSignin}
        handleSignout={handleSignout}
      />
      {mainContainer}
      <PostFavoriteSnackbars
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
      />
    </ThemeProvider>
  );
};

export default App;
