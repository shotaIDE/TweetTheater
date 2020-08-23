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
import * as History from "history";
import React from "react";
import { withRouter } from "react-router";

import { SigninStatus } from "./App";
import { officialTwitterAccountDidClick } from "./GoogleAnalyticsEvents";
import { officialTwitterAccountUrl } from "./OfficialAccountInfo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    titleLink: {
      color: theme.palette.text.primary,
      cursor: "pointer",
    },
    title: {
      marginLeft: theme.spacing(1),
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

interface Props {
  isPC: boolean;
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

    window.open(officialTwitterAccountUrl, "_blank", "noopener");

    officialTwitterAccountDidClick();
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

  const logoField = props.isPC ? (
    <Typography variant="h6" className={classes.title}>
      {process.env.REACT_APP_SITE_TITLE}
    </Typography>
  ) : (
    <img src="logo.svg" alt="ロゴ画像" width="24" height="24" />
  );

  const suffix = props.isPC
    ? `${process.env.REACT_APP_SEARCH_TEXT} - [ ${props.titleSuffix} ]`
    : `${props.titleSuffix} - ${process.env.REACT_APP_SEARCH_TEXT}`;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link
          className={classes.titleLink}
          underline="none"
          onClick={handlePlayerPage}
        >
          {logoField}
        </Link>
        <Typography variant="h6" noWrap={true} className={classes.title}>
          {suffix}
        </Typography>
        {menu}
      </Toolbar>
    </AppBar>
  );
});
