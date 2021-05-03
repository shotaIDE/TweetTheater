import { Badge, Divider, Link } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Notifications from "@material-ui/icons/Notifications";
import * as History from "history";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

import { SigninStatus } from "./App";
import {
  registerOfficialTwitterAccountClickEvent,
  registerOpenNotificationEvent,
} from "./GoogleAnalyticsEvents";
import {
  officialTwitterAccountUrl,
  privacyPolicyUrl,
  termsOfUseUrl,
} from "./OfficialAccountInfo";
import {
  getNotifications,
  getReadNotificationIdList,
  Notification,
  storeReadNotificationIdList,
} from "./repotiroy/NotificationsRepository";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleLink: {
      color: theme.palette.text.primary,
      cursor: "pointer",
    },
    title: {
      marginLeft: theme.spacing(1),
      flexGrow: 1,
    },
    notificationMenuItem: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
);

interface Props {
  children: React.ReactElement;
  playerPositionLabel: string;
  signinStatus: SigninStatus;
  userName: string;
  history: History.history;
  handleSignout: () => void;
}

export const MenuBar = withRouter((props: Props) => {
  const classes = useStyles(props);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotificationIdList, setReadNotificationIdList] = useState<
    string[]
  >([]);
  const [numUnreadNotifications, setNumUnreadNotifications] = useState(0);

  const [
    generalMenuAnchorEl,
    setGeneralMenuAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const generalMenuOpen = Boolean(generalMenuAnchorEl);

  const [
    notificationMenuAnchorEl,
    setNotificationMenuAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const notificationMenuOpen = Boolean(notificationMenuAnchorEl);

  useEffect(() => {
    setNotifications(getNotifications());
    setReadNotificationIdList(getReadNotificationIdList());
  }, []);

  useEffect(() => {
    const unreadNotifications = notifications.filter((notification) => {
      const id = notification.id;
      return !readNotificationIdList.includes(id);
    });
    setNumUnreadNotifications(unreadNotifications.length);
  }, [notifications, readNotificationIdList]);

  const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchorEl(event.currentTarget);

    const readNotificationIdList = notifications.map(
      (notification) => notification.id
    );
    storeReadNotificationIdList(readNotificationIdList);

    setReadNotificationIdList(getReadNotificationIdList());

    registerOpenNotificationEvent();
  };

  const handleOpenGeneralMenu = (event: React.MouseEvent<HTMLElement>) => {
    setGeneralMenuAnchorEl(event.currentTarget);
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

    window.open(termsOfUseUrl, "_blank", "noopener");
  };

  const handlePrivacyPolicy = () => {
    handleClose();

    window.open(privacyPolicyUrl, "_blank", "noopener");
  };

  const handleTwitterAccount = () => {
    handleClose();

    window.open(officialTwitterAccountUrl, "_blank", "noopener");

    registerOfficialTwitterAccountClickEvent();
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchorEl(null);
  };

  const handleClose = () => {
    setGeneralMenuAnchorEl(null);
  };

  const notificationMenuItems = (
    <div>
      {notifications.map((notification) => {
        const read = readNotificationIdList.includes(notification.id);
        return (
          <div key={notification.id} className={classes.notificationMenuItem}>
            {notification.body(read)}
          </div>
        );
      })}
    </div>
  );

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
        onClick={handleOpenNotificationMenu}
        color="inherit"
      >
        <Badge badgeContent={numUnreadNotifications} color="secondary">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={notificationMenuAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={notificationMenuOpen}
        onClose={handleNotificationMenuClose}
      >
        {notificationMenuItems}
      </Menu>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenGeneralMenu}
        color="inherit"
      >
        {menuIcon}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={generalMenuAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={generalMenuOpen}
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
        <Link
          className={classes.titleLink}
          underline="none"
          onClick={handlePlayerPage}
        >
          {props.children}
        </Link>
        <Typography variant="h6" noWrap={true} className={classes.title}>
          {props.playerPositionLabel}
        </Typography>
        {menu}
      </Toolbar>
    </AppBar>
  );
});
