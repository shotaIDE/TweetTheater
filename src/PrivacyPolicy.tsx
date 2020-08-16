import "firebase/analytics";
import "./App.css";

import { Container, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as firebase from "firebase/app";
import React, { useEffect } from "react";

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
  })
);

interface Props {}

export const PrivacyPolicy = (props: Props) => {
  const classes = useStyles(props);

  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS === "enabled") {
      firebase.analytics();
    }
  }, []);

  return (
    <Container className={classes.root}>
      <Typography>プライバシーポリシー</Typography>
    </Container>
  );
};
