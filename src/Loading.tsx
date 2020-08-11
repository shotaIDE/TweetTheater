import { Box, CircularProgress, Container } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      height: 600,
    },
    messagePaper: {
      maxWidth: 600,
      padding: theme.spacing(2),
    },
    title: {
      margin: theme.spacing(2),
    },
    body: {
      margin: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(2),
    },
  })
);

export const Loading = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Box display="flex" alignItems="center">
        <Box>
          <CircularProgress />
        </Box>
      </Box>
    </Container>
  );
};
