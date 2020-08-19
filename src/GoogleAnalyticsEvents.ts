import "firebase/analytics";

import * as firebase from "firebase/app";

export const officialTwitterAccountDidClick = () => {
  firebase.analytics().logEvent("open_official_twitter");
};
