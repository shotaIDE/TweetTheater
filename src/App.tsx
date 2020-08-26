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
import { PrivacyPolicy } from "./PrivacyPolicy";
import { TermsOfUse } from "./TermsOfUse";

export type SigninStatus = "unknown" | "signined" | "notSignined";

export type SigninAdditionalExplanation =
  | "unknown"
  | "none"
  | "show_not_to_do"
  | "show_twitter_restriction";

firebase.initializeApp(firebaseConfig);

declare global {
  interface Window {
    dataLayer: any;
    gtag: any;
    google_optimize: any;
  }
}

let intervalId;

const App = () => {
  const [signinStatus, setSigninStatus] = useState<SigninStatus>("unknown");
  const [
    signinAdditionalExplanation,
    setSigninAdditionalExplanation,
  ] = useState<SigninAdditionalExplanation>("unknown");
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

    if (process.env.REACT_APP_GOOGLE_OPTIMIZE_CONTAINER_ID) {
      window.dataLayer.push({ event: "optimize.activate" });

      intervalId = setInterval(() => {
        if (window.google_optimize !== undefined) {
          const variant = window.google_optimize.get(
            process.env.REACT_APP_GOOGLE_OPTIMIZE_EXPERIENCE_ID
          );
          console.log(variant);
          if (variant === "1") {
            setSigninAdditionalExplanation("show_not_to_do");
          } else if (variant === "2") {
            setSigninAdditionalExplanation("show_twitter_restriction");
          } else {
            setSigninAdditionalExplanation("none");
          }
          clearInterval(intervalId);
        }
      }, 100);
    } else {
      setSigninAdditionalExplanation("none");
    }
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
                signinAdditionalExplanation={signinAdditionalExplanation}
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
          <Route exact path="/privacypolicy/" component={PrivacyPolicy} />
          <Route exact path="/termsofuse/" component={TermsOfUse} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
