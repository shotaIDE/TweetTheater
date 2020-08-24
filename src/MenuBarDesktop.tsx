import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { SigninStatus } from "./App";
import { MenuBar } from "./MenuBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: theme.spacing(1),
      flexGrow: 1,
    },
  })
);

interface Props {
  playerPosition: string;
  signinStatus: SigninStatus;
  userName: string;
  handleSignout: () => void;
}

export const MenuBarDesktop = (props: Props) => {
  const classes = useStyles(props);

  const playerPositionLabel = `${process.env.REACT_APP_SEARCH_TEXT} - [ ${props.playerPosition} ]`;

  return (
    <MenuBar
      playerPositionLabel={playerPositionLabel}
      signinStatus={props.signinStatus}
      userName={props.userName}
      handleSignout={props.handleSignout}
    >
      <Typography variant="h6" className={classes.title}>
        {process.env.REACT_APP_SITE_TITLE}
      </Typography>
    </MenuBar>
  );
};
