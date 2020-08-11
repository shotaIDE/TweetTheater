import { createMuiTheme } from "@material-ui/core";

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export const getTheme = (isDark: boolean) => {
  return isDark ? darkTheme : lightTheme;
};
