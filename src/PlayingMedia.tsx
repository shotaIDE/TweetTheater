import { Grid } from "@material-ui/core";
import React from "react";

import { Video } from "./Video";

interface Props {
  currentUrl: string;
  onEnded: () => void;
}

export const PlayingMedia = (props: Props) => {
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}>
        <Video src={props.currentUrl} onEnded={props.onEnded} />
      </Grid>
    </Grid>
  );
};
