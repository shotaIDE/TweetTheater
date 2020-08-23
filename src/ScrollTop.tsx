import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

interface Props {
  children: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

export const ScrollTop = (props: Props) => {
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div onClick={handleClick} role="presentation" className={classes.root}>
      {props.children}
    </div>
  );
};
