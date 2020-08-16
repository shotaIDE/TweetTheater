import { Box, Container, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      height: 600,
    },
  })
);

interface Props {
  favoriteEnabled: boolean;
  handleSignin: () => void;
}

export const NotFound = (props: Props) => {
  const classes = useStyles(props);

  return (
    <Container className={classes.root}>
      <Box display="flex" alignItems="center">
        <Typography variant="h5" align="center">
          ページが見つかりません
        </Typography>
      </Box>
    </Container>
  );
};
