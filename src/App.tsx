import React, { useState, useEffect } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";

const STORAGE_ACCESS_TOKEN_KEY = 'accessToken';
const STORAGE_SECRET_KEY = 'secret';

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
}

const App = () => {
  const restoredAccessToken = localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY);
  const restoredSecret = localStorage.getItem(STORAGE_SECRET_KEY);

  const [videoList, setVideoList] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [signined, setSignined] = useState(false);
  const [accessToken, setAccessToken] = useState(restoredAccessToken);
  const [secret, setSecret] = useState(restoredSecret);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Signined');
        setSignined(true);
        return;
      }
      setSignined(false);
      console.log('Not Signined');
    });

    firebase.auth().getRedirectResult().then(result => {
      const fetchedAccessToken = result.credential['accessToken']
      const fetchedSecret = result.credential['secret']

      localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, fetchedAccessToken);
      localStorage.setItem(STORAGE_SECRET_KEY, fetchedSecret);

      setAccessToken(fetchedAccessToken);
      setSecret(fetchedSecret);

      console.log(`Redirect results: ${result}`);
    }).catch(error => {
      console.log(`Auth failed: ${error}`);
    });
  }, []);

  useEffect(() => {
    if (accessToken == null || secret == null) {
      return;
    }

    (async () => {
      const fetchUrl = 'http://127.0.0.1:8000/fetch/';
      const params = {
        accessToken: accessToken,
        secret: secret,
      }
      const response = await fetch(
        fetchUrl,
        {
          method: 'POST',
          body: Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&'),
        }
      );
      const json = await response.json();

      setVideoList(json);
    })();
  }, [secret]);

  const onEnded = () => {
    const nextVideoId = currentVideoId + 1;
    setCurrentVideoId(nextVideoId);
    console.log(videoList[currentVideoId].video_url);
  }

  const tweetList = videoList.map((tweet, id) => {
    const backgroundColor = id == currentVideoId ? 'gray' : 'white'
    const favoriteLabel = tweet.favorited ? "Favorited" : "NOT Favorited"

    return (
      <div
        key={tweet.detail_url}
        style={{
          background: backgroundColor,
        }}>
        <div>
          <img src={tweet.user_profile_image_url} />
        </div>
        <div>
          {tweet.user_display_name} @{tweet.user_name}
        </div>
        <div>
          {tweet.created_at}
        </div>
        <div>
          {tweet.text}
        </div>
        <div>
          {favoriteLabel}
        </div>
        <div>
          <a 
            href={tweet.detail_url}
            target="_blank">
            {tweet.detail_url}
          </a>
        </div>
      </div>)
  });

  const currentVideoUrl = (videoList.length > currentVideoId) ? videoList[currentVideoId].video_url : ''

  const signinButton = signined ? (<button onClick={signout}>サインアウト</button>): (<button onClick={signin}>サインイン</button>);

  return (
    <div className="App">
      {signinButton}
      <div style={
        {
          marginLeft: 16,
          marginRight: "51%",
        }
      }>
      {tweetList}
      </div>
      <div style={{
        position: "fixed",
        top: 0,
        left: "51%",
      }}>
        <div>
          {currentVideoId + 1} / {videoList.length}
        </div>
        <Video src={currentVideoUrl} onEnded={onEnded} />
      </div>
    </div>
  );
}

interface Props {
  src: string,
  onEnded: any,
}

const Video = (props: Props) => {
  return (
  <video key={props.src} autoPlay controls onEnded={props.onEnded}>
    <source src={props.src} type="video/mp4"></source>
  </video>
  )
}

export default App;
