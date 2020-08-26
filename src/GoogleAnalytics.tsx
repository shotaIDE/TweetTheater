import * as History from "history";
import React, { useEffect } from "react";
import { withRouter } from "react-router";

import { registerPageViewEvent } from "./GoogleAnalyticsEvents";

interface Props {
  history: History.history;
}

export const GoogleAnalytics = withRouter((props: Props) => {
  useEffect(() => {
    // ページ初回読み込み時の閲覧イベント登録
    registerPageViewEvent(window.location.pathname);

    props.history.listen((location, _) => {
      // ページ切り替え時の閲覧イベント登録
      registerPageViewEvent(location.pathname);
    });
  }, [props.history]);

  return <div></div>;
});
