import "firebase/analytics";

import { Divider, Link } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as firebase from "firebase/app";
import * as History from "history";
import React from "react";
import { withRouter } from "react-router";

import { SigninStatus } from "./App";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    titleLink: {
      color: theme.palette.text.primary,
      cursor: "pointer",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

interface Props {
  titleSuffix: string;
  signinStatus: SigninStatus;
  userName: string;
  history: History.history;
  handleSignout: () => void;
}

export const MenuBar = withRouter((props: Props) => {
  const classes = useStyles(props);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSignout = () => {
    handleClose();
    props.handleSignout();
  };

  const handlePlayerPage = () => {
    props.history.push("/");
  };

  const handleTermsOfUse = () => {
    handleClose();

    props.history.push("/termsofuse/");
  };

  const handlePrivacyPolicy = () => {
    handleClose();

    props.history.push("/privacypolicy/");
  };

  const handleTwitterAccount = () => {
    handleClose();

    window.open("https://twitter.com/TweetTheaterApp", "_blank", "noopener");

    firebase.analytics().logEvent("open_official_twitter");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const generalMenuItems = (
    <div>
      <MenuItem onClick={handleTermsOfUse}>利用規約</MenuItem>
      <MenuItem onClick={handlePrivacyPolicy}>プライバシーポリシー</MenuItem>
      <MenuItem onClick={handleTwitterAccount}>公式Twitterアカウント</MenuItem>
    </div>
  );

  const userMenuItems =
    props.signinStatus === "signined" ? (
      <div>
        <MenuItem disabled>{props.userName} さん</MenuItem>
        <MenuItem onClick={handleSignout}>サインアウト</MenuItem>
        <Divider />
      </div>
    ) : null;

  const menuIcon =
    props.signinStatus === "signined" ? <AccountCircle /> : <MoreVertIcon />;

  const menu = (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {menuIcon}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        {userMenuItems}
        {generalMenuItems}
      </Menu>
    </div>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link
            className={classes.titleLink}
            underline="none"
            onClick={handlePlayerPage}
          >
            {process.env.REACT_APP_SITE_TITLE}
          </Link>
          {props.titleSuffix}
        </Typography>
        {menu}
      </Toolbar>
    </AppBar>
  );
});
