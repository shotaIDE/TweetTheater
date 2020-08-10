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
  signined: boolean;
  userName: string;
  handleSignin: any;
  handleSignout: any;
}

export const SigninStatusBar = (props: Props) => {
  const classes = useStyles();

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

  const signinStatus = props.signined ? (
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
  ) : (
    <Button color="inherit" onClick={props.handleSignin}>
      サインイン
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Auto Play Client {props.titleSuffix}
        </Typography>
        {signinStatus}
      </Toolbar>
    </AppBar>
  );
};
