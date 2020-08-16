import "./App.css";

import { Container, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

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

  return (
    <Container className={classes.root}>
      <Typography>プライバシーポリシー</Typography>
    </Container>
  );
};
