import * as History from "history";
import React, { useEffect } from "react";
import { withRouter } from "react-router";

import { registerPageViewEvent } from "./GoogleAnalyticsEvents";

interface Props {
  history: History.history;
}

export const GoogleAnalytics = withRouter((props: Props) => {
  useEffect(() => {
    // ページ初回読み込みの際の初期化
    registerPageViewEvent(window.location.pathname);

    props.history.listen((location, _) => {
      // ページ切り替え時のイベント登録
      registerPageViewEvent(location.pathname);
    });
  }, [props.history]);

  return <div></div>;
});
