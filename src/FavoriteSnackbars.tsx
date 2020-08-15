import Snackbar from "@material-ui/core/Snackbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

export type FavoriteResult =
  | "succeed"
  | "already favorited"
  | "unknown error"
  | null;

interface Props {
  open: FavoriteResult;
  handleClose: () => void;
}

export const FavoriteSnackbars = (props: Props) => {
  const classes = useStyles();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    props.handleClose();
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.open === "succeed"}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          いいねしました
        </Alert>
      </Snackbar>
      <Snackbar
        open={props.open === "unknown error"}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          エラーが発生しました。時間をおいて再度お試しください。
        </Alert>
      </Snackbar>
      <Snackbar
        open={props.open === "already favorited"}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info">
          すでにいいねしています
        </Alert>
      </Snackbar>
    </div>
  );
};
