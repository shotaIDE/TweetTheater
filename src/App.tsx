import "firebase/auth";
import "./App.css";

import { Container, CssBaseline, Grid, ThemeProvider } from "@material-ui/core";
import * as firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import { SigninStatusBar } from "./AppBar";
import { darkTheme } from "./DarkTheme";
import { Loading } from "./Loading";
import { NeedSignin } from "./NeedSignin";
import { TweetStatus } from "./TweetCard";
import { Tweet, TweetCardInfo, TweetCardList } from "./TweetCardList";

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

const App = () => {
  const [signinStatus, setSigninStatus] = useState<SigninStatus>("unknown");
  const [videoList, setVideoList] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [playedList, setPlayedList] = useState([]);
  const [userName, setUserName] = useState(null);
  const [idToken, setIDToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [secret, setSecret] = useState(null);

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

      setPlayedList([json.length, false]);
      setVideoList(json);
    })();
  }, [accessToken, idToken, secret, uid]);

  // 一つの動画の再生が完了した場合
  const onEnded = () => {
    let updatedPlayedList = playedList;
    updatedPlayedList[currentVideoId] = true;
    setPlayedList(updatedPlayedList);

    const nextVideoId = currentVideoId + 1;
    if (nextVideoId >= videoList.length) {
      setCurrentVideoId(-1);
      return;
    }

    setCurrentVideoId(nextVideoId);

    console.log(videoList[currentVideoId].video_url);
  };

  const onClick = (id: number) => {
    setCurrentVideoId(id);
  };

  const tweetCardInfoList = videoList.map(
    (video, id): TweetCardInfo => {
      const status: TweetStatus =
        id === currentVideoId ? "playing" : playedList[id] ? "played" : "none";

      const tweet: Tweet = {
        userName: video.user_name,
        userDisplayName: video.user_name,
        userProfileImageUrl: video.user_profile_image_url,
        detailUrl: video.detail_url,
        text: video.text,
        createdAt: video.created_at,
      };

      return {
        tweet: tweet,
        status: status,
      };
    }
  );

  const isPlayingVideo = currentVideoId >= 0;
  const currentVideoUrl =
    isPlayingVideo && currentVideoId < videoList.length
      ? videoList[currentVideoId].video_url
      : "";

  const currentPosition = ` - [ ${
    isPlayingVideo ? currentVideoId + 1 : "-"
  } / ${videoList.length} ]`;

  const mainContainer =
    signinStatus === "signined" ? (
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TweetCardList tweetList={tweetCardInfoList} onClick={onClick} />
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
            <Grid
              container
              spacing={2}
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item xs={12}>
                <Video src={currentVideoUrl} onEnded={onEnded} />
              </Grid>
            </Grid>
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
    </ThemeProvider>
  );
};

interface Props {
  src: string;
  onEnded: () => void;
}

const Video = (props: Props) => {
  return (
    <video
      key={props.src}
      autoPlay
      controls
      onEnded={props.onEnded}
      style={{ width: "100%" }}
    >
      <source src={props.src} type="video/mp4"></source>
    </video>
  );
};

export default App;
