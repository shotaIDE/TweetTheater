import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React from "react";

import { ScrollTop } from "./ScrollTop";
import { TweetStatus } from "./TweetCard";
import { Tweet, TweetCardList } from "./TweetCardList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    root: {
      display: "flex",
      justifyContent: "center",
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  tweetList: Tweet[];
  statusList: TweetStatus[];
  fetchError: boolean;
  handleClickOpen: () => void;
  handleClose: () => void;
  onClick: (_: number) => void;
}

export const ListDialog = (props: Props) => {
  const classes = useStyles(props);

  const onClick = (id: number) => {
    props.handleClose();
    props.onClick(id);
  };

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            ツイート一覧
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container className={classes.root}>
        <TweetCardList
          tweetList={props.tweetList}
          statusList={props.statusList}
          fetchError={props.fetchError}
          onClick={onClick}
        />
        <ScrollTop {...props}>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Container>
    </Dialog>
  );
};
