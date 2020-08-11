import {
  Box,
  CircularProgress,
  Container,
  makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    height: 600,
  },
  messagePaper: {
    maxWidth: 600,
    padding: 16,
  },
  title: {
    margin: 16,
  },
  body: {
    margin: 16,
  },
  button: {
    margin: 16,
  },
});

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
