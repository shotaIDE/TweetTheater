import "firebase/analytics";

import * as firebase from "firebase/app";
import * as History from "history";
import React, { useEffect } from "react";
import { withRouter } from "react-router";

interface Props {
  history: History.history;
}

export const GoogleAnalytics = withRouter((props: Props) => {
  useEffect(() => {
    console.log("useEffect called");

    if (process.env.REACT_APP_GOOGLE_ANALYTICS !== "enabled") {
      return;
    }

    // ページ初回読み込みの際の初期化
    // 基本イベントが自動で登録される
    firebase.analytics();

    props.history.listen((location, action) => {
      // ページ切り替え時のイベント登録
      console.log("history did changed");
      firebase.analytics().logEvent("page_view", {});
    });
  }, [props.history]);

  return <div></div>;
});
