import "firebase/auth";
import "./App.css";

import { Container, Grid } from "@material-ui/core";
import * as firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import { Tweet, TweetCard, TweetStatus } from "./Tweet";

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

const signin = () => {
  firebase.auth().signInWithRedirect(provider);
};

const signout = () => {
  localStorage.clear();

  firebase.auth().signOut();
};

const App = () => {
  const [videoList, setVideoList] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [playedList, setPlayedList] = useState([]);
  const [signined, setSignined] = useState(false);
  const [idToken, setIDToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [secret, setSecret] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((fetchedIDToken) => {
          setIDToken(fetchedIDToken);
          setSignined(true);
          console.log(fetchedIDToken);
        });
        return;
      }
      setSignined(false);
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

  const onClicked = (id: number) => {
    setCurrentVideoId(id);
  };

  const tweetList = videoList.map((tweet, id) => {
    const status: TweetStatus =
      id === currentVideoId ? "playing" : playedList[id] ? "played" : "none";

    const tweet2: Tweet = {
      userName: tweet.user_name,
      userDisplayName: tweet.user_name,
      userProfileImageUrl: tweet.user_profile_image_url,
      detailUrl: tweet.detail_url,
      text: tweet.text,
      createdAt: tweet.created_at,
    };

    return (
      <TweetCard
        key={tweet.detail_url}
        tweet={tweet2}
        status={status}
        onClick={() => onClicked(id)}
      />
    );
  });

  const currentVideoUrl =
    currentVideoId >= 0 && currentVideoId < videoList.length
      ? videoList[currentVideoId].video_url
      : "";

  const signinButton = signined ? (
    <button onClick={signout}>サインアウト</button>
  ) : (
    <button onClick={signin}>サインイン</button>
  );

  return (
    <div className="App">
      {signinButton}
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            {tweetList}
          </Grid>
          <Grid item xs={6}>
            <div
              style={{
                position: "fixed",
                left: "51%",
                width: 600,
              }}
            >
              <div>
                {currentVideoId + 1} / {videoList.length}
              </div>
              <Video src={currentVideoUrl} onEnded={onEnded} />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

interface Props {
  src: string;
  onEnded: any;
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
