import {
  Box,
  Button,
  Container,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    height: 600,
  },
  messagePaper: {
    maxWidth: 600,
    padding: 16,
  },
  title: {
    margin: 16,
  },
  body: {
    margin: 16,
  },
  button: {
    margin: 16,
  },
});

interface Props {
  handleSignin: () => void;
}

export const NeedSignin = (props: Props) => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Box display="flex" alignItems="center">
        <Box>
          <Paper className={classes.messagePaper}>
            <Typography className={classes.title} variant="h5" align="center">
              ご利用にはTwitterでのサインインが必要です
            </Typography>
            <Typography
              className={classes.body}
              variant="subtitle1"
              align="left"
            >
              本ウェブサイトで、Twitterの検索結果の表示といいねをするために、Twitterアカウントへのアクセスを許可してください。
            </Typography>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={props.handleSignin}
            >
              サインイン
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
