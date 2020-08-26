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

import { SigninAdditionalExplanation } from "./App";

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
    link: {
      color: theme.palette.primary.light,
    },
    button: {
      margin: theme.spacing(2),
    },
  })
);

interface Props {
  additionalExplanation: SigninAdditionalExplanation;
  favoriteEnabled: boolean;
  history: History.history;
  handleSignin: () => void;
}

export const NeedSignin = withRouter((props: Props) => {
  const [inSignin, setInSignin] = useState(false);

  const classes = useStyles(props);

  const message =
    props.additionalExplanation === "show_not_to_do" ? (
      <Typography className={classes.body} variant="subtitle1" align="left">
        サインインにより得られた情報は、本ウェブサイトのサービスの機能・運用の目的でのみで利用されます。その他の目的で利用することや、第三者に提供することはありません。
      </Typography>
    ) : props.additionalExplanation === "show_twitter_restriction" ? (
      <Typography className={classes.body} variant="subtitle1" align="left">
        本ウェブサイトではTwitterが提供している検索結果取得のAPIを利用するため、ユーザー様のTwitterアカウントでサインインする必要があります。
        APIについては、
        <Link
          className={classes.link}
          href="https://help.twitter.com/ja/rules-and-policies/twitter-api"
          target="_blank"
          referrerPolicy="noopener"
        >
          Twitter公式の説明ページ
        </Link>
        をご覧ください。
      </Typography>
    ) : props.favoriteEnabled ? (
      <Typography className={classes.body} variant="subtitle1" align="left">
        本ウェブサイトで、Twitterの検索結果の表示といいねをするために、Twitterアカウントでサインインしてください。
      </Typography>
    ) : (
      <Typography className={classes.body} variant="subtitle1" align="left">
        本ウェブサイトで、Twitterの検索結果の表示するために、Twitterアカウントでサインインしてください。
      </Typography>
    );

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
          {message}
          <Typography className={classes.body} variant="subtitle2" align="left">
            サインインにより、
            <Link className={classes.link} href="" onClick={handleTermsOfUse}>
              利用規約
            </Link>
            と
            <Link
              className={classes.link}
              href=""
              onClick={handlePrivacyPolicy}
            >
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
