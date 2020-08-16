import "firebase/auth";
import "firebase/analytics";
import "./App.css";

import { CssBaseline, ThemeProvider } from "@material-ui/core";
import * as firebase from "firebase/app";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { darkTheme } from "./DarkTheme";
import { firebaseConfig } from "./FirebaseConfig";
import { MenuBar } from "./MenuBar";
import { Player } from "./Player";
import { PrivacyPolicy } from "./PrivacyPolicy";

export type SigninStatus = "unknown" | "signined" | "notSignined";

firebase.initializeApp(firebaseConfig);

const App = () => {
  const [signinStatus, setSigninStatus] = useState<SigninStatus>("unknown");
  const [userName, setUserName] = useState(null);
  const [idToken, setIDToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [titleSuffix, setTitleSuffix] = useState("");

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

        const fetchUrl = `${process.env.REACT_APP_API_ORIGIN}/api/user/create`;
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
      .catch((_) => {
        console.log("Not redirected");
      });
  }, []);

  const handleSignin = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  const handleSignout = () => {
    firebase.auth().signOut();
  };

  const titleSuffixDidChange = (title: string) => {
    setTitleSuffix(title);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <MenuBar
          titleSuffix={titleSuffix}
          signinStatus={signinStatus}
          userName={userName}
          handleSignout={handleSignout}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Player
                signinStatus={signinStatus}
                userName={userName}
                idToken={idToken}
                uid={uid}
                accessToken={accessToken}
                secret={secret}
                handleSignin={handleSignin}
                titleSuffixDidChange={titleSuffixDidChange}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/privacy/"
            render={(props) => (
              <PrivacyPolicy
                signinStatus={signinStatus}
                userName={userName}
                {...props}
              />
            )}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
