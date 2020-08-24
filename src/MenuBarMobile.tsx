import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { SigninStatus } from "./App";
import { MenuBar } from "./MenuBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      marginTop: theme.spacing(0.5),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 20,
      height: 20,
    },
  })
);

interface Props {
  playerPosition: string;
  signinStatus: SigninStatus;
  userName: string;
  handleSignout: () => void;
}

export const MenuBarMobile = (props: Props) => {
  const classes = useStyles(props);

  const playerPositionLabel = `${props.playerPosition} - ${process.env.REACT_APP_SEARCH_TEXT}`;

  return (
    <MenuBar
      playerPositionLabel={playerPositionLabel}
      signinStatus={props.signinStatus}
      userName={props.userName}
      handleSignout={props.handleSignout}
    >
      <img src="logo.svg" alt="ロゴ" className={classes.image} />
    </MenuBar>
  );
};
