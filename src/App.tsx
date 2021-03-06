import "firebase/auth";
import "./App.css";

import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as firebase from "firebase/app";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { darkTheme } from "./DarkTheme";
import { firebaseConfig } from "./FirebaseConfig";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { registerSigninEvent } from "./GoogleAnalyticsEvents";
import { MenuBarDesktop } from "./MenuBarDesktop";
import { MenuBarMobile } from "./MenuBarMobile";
import { NotFound } from "./NotFound";
import { Player } from "./Player";
import { storeEncryptedCredentials } from "./UserCredentials";

export type SigninStatus = "unknown" | "signined" | "notSignined";

firebase.initializeApp(firebaseConfig);

declare global {
  interface Window {
    dataLayer: any;
    gtag: any;
    google_optimize: any;
  }
}

const App = () => {
  const [signinStatus, setSigninStatus] = useState<SigninStatus>("unknown");
  const [userName, setUserName] = useState(null);
  const [idToken, setIDToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [playerPosition, setPlayerPosition] = useState("");

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

        registerSigninEvent();

        console.log(
          `Signined: UID=${uid.substring(0, 5)}... ` +
            `AccessToken=${accessToken.substring(0, 5)}... ` +
            `Secret=${secret.substring(0, 5)}`
        );
      })
      .catch((_) => {
        console.log("Not redirected");
      });
  }, []);

  useEffect(() => {
    if (idToken == null || accessToken == null || secret == null) {
      return;
    }

    const fetchUrl = `${process.env.REACT_APP_API_ORIGIN}/api/user/create`;
    const params = {
      idToken: idToken,
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
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        storeEncryptedCredentials(json);
      });
  }, [accessToken, idToken, secret]);

  const handleSignin = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  const handleSignout = () => {
    firebase.auth().signOut();
  };

  const handleChangePlayerPosition = (title: string) => {
    setPlayerPosition(title);
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const menuBar = isDesktop ? (
    <MenuBarDesktop
      playerPosition={playerPosition}
      signinStatus={signinStatus}
      userName={userName}
      handleSignout={handleSignout}
    />
  ) : (
    <MenuBarMobile
      playerPosition={playerPosition}
      signinStatus={signinStatus}
      userName={userName}
      handleSignout={handleSignout}
    />
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <GoogleAnalytics />
        {menuBar}
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Player
                isDesktop={isDesktop}
                signinStatus={signinStatus}
                userName={userName}
                idToken={idToken}
                uid={uid}
                accessToken={accessToken}
                secret={secret}
                handleSignin={handleSignin}
                handleChangePosition={handleChangePlayerPosition}
                {...props}
              />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
