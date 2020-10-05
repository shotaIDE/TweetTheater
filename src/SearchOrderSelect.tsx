import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { SearchSort } from "./Player";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
    },
    explanation: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

interface Props {
  searchOrder: SearchSort;
  handleSelectSearchOrder: (_: SearchSort) => void;
}

export const SearchOrderSelect = (props: Props) => {
  const classes = useStyles(props);

  const handleChange = (event) => {
    const changedValue = event.target.value;
    props.handleSelectSearchOrder(changedValue);
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">検索順</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={props.searchOrder}
        onChange={handleChange}
        label="検索順"
      >
        <MenuItem value={"descend of datetime"}>新しく投稿された順</MenuItem>
        <MenuItem value={"ascend of datetime from 21:00 at 1day before"}>
          1日前の21時以降で早く投稿された順
        </MenuItem>
        <MenuItem value={"ascend of datetime from 21:00 at 2days before"}>
          2日前の21時以降で早く投稿された順
        </MenuItem>
        <MenuItem value={"customized"}>カスタマイズ</MenuItem>
      </Select>
    </FormControl>
  );
};
