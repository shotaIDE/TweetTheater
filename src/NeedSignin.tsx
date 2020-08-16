import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as History from "history";
import React, { useState } from "react";
import { withRouter } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      height: 600,
    },
    messagePaper: {
      maxWidth: 600,
      padding: theme.spacing(2),
    },
    title: {
      margin: theme.spacing(2),
    },
    body: {
      margin: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(2),
    },
  })
);

interface Props {
  favoriteEnabled: boolean;
  history: History.history;
  handleSignin: () => void;
}

export const NeedSignin = withRouter((props: Props) => {
  const [inSignin, setInSignin] = useState(false);

  const classes = useStyles(props);

  const message = props.favoriteEnabled
    ? "本ウェブサイトで、Twitterの検索結果の表示といいねをするために、Twitterアカウントでサインインしてください。"
    : "本ウェブサイトで、Twitterの検索結果の表示するために、Twitterアカウントでサインインしてください。";

  const handleSignin = () => {
    // ボタンクリック後にページ遷移まで時間がかかる場合があるため、
    // 多重にクリックされないようにボタンを無効化する
    setInSignin(true);

    props.handleSignin();
  };

  const handleTermsOfUse = () => {
    props.history.push("/termsofuse/");
  };

  const handlePrivacyPolicy = () => {
    props.history.push("/privacypolicy/");
  };

  return (
    <Container className={classes.root}>
      <Box display="flex" alignItems="center">
        <Paper className={classes.messagePaper}>
          <Typography className={classes.title} variant="h5" align="center">
            ご利用にはTwitterでのサインインが必要です
          </Typography>
          <Typography className={classes.body} variant="subtitle1" align="left">
            {message}
          </Typography>
          <Typography className={classes.body} variant="subtitle2" align="left">
            サインインすることで、
            <Link href="" onClick={handleTermsOfUse}>
              利用規約
            </Link>
            と
            <Link href="" onClick={handlePrivacyPolicy}>
              プライバシーポリシー
            </Link>
            に同意することになります。
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              className={classes.button}
              variant="contained"
              size="large"
              color="primary"
              disabled={inSignin}
              onClick={handleSignin}
            >
              サインイン
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
});
