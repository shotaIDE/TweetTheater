import { Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React from "react";

import { SigninStatus } from "./App";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

interface Props {
  titleSuffix: string;
  inSignin: boolean;
  signinStatus: SigninStatus;
  userName: string;
  handleSignin: () => void;
  handleSignout: () => void;
}

export const SigninStatusBar = (props: Props) => {
  const classes = useStyles(props);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSignout = () => {
    handleClose();
    props.handleSignout();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const signinStatus =
    props.signinStatus === "signined" ? (
      <div>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
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
          <MenuItem disabled>{props.userName} さん</MenuItem>
          <MenuItem onClick={handleSignout}>サインアウト</MenuItem>
        </Menu>
      </div>
    ) : props.signinStatus === "notSignined" ? (
      <Button
        color="inherit"
        disabled={props.inSignin}
        onClick={props.handleSignin}
      >
        サインイン
      </Button>
    ) : null;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          {process.env.REACT_APP_SITE_TITLE} {props.titleSuffix}
        </Typography>
        {signinStatus}
      </Toolbar>
    </AppBar>
  );
};
