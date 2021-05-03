import { Card, CardContent, Grid, Link } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";

import {
  registerOpenAppStoreEvent,
  registerOpenGooglePlayEvent,
} from "../GoogleAnalyticsEvents";

const USER_NOTIFICATIONS_STORAGE_KEY = "userNotifications";

export class Notification {
  id: string;
  body: (boolean) => JSX.Element;

  constructor(id: string, body: (boolean) => JSX.Element) {
    this.id = id;
    this.body = body;
  }
}

class UserNotificationsInfo {
  read: string[] = [];
}

export const getNotifications = (): Notification[] => {
  return [
    new Notification("001", (read: boolean) => {
      return (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              2021年5月4日 0:00
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              color={read ? "textSecondary" : "textPrimary"}
            >
              スマホアプリ版がリリースされました！
            </Typography>
            <Typography
              variant="body2"
              component="p"
              color={read ? "textSecondary" : "textPrimary"}
            >
              深夜の2時間DTMの自動再生ツールの、スマホアプリ版がリリースされました！
              <br />
              無料でログインせずに利用することもできますので、気軽にお試しください。
              <br />
            </Typography>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Link
                href="https://apps.apple.com/jp/app/tweet-theater/id1545902971"
                target="_blank"
                rel="noopener"
                onClick={registerOpenAppStoreEvent}
              >
                <img
                  height={70}
                  style={{ padding: "10px" }}
                  src="Download_on_the_App_Store_Badge_JP_RGB_blk_100317.svg"
                  alt="App Store で手に入れよう"
                />
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=ide.shota.colomney.tweet_theater"
                target="_blank"
                rel="noopener"
                onClick={registerOpenGooglePlayEvent}
              >
                <img
                  height={70}
                  alt="Google Play で手に入れよう"
                  src="https://play.google.com/intl/ja/badges/static/images/badges/ja_badge_web_generic.png"
                />
              </Link>
            </Grid>
            <Typography
              variant="body2"
              component="p"
              color={read ? "textSecondary" : "textPrimary"}
            >
              スマホアプリ版では、Web版よりも多くのことができます <br />
              ・&quot;#深夜の2時間DTM&quot; 以外の好きなキーワードで検索する
              <br />
              ・最後に聴いていたツイートから再生する <br />
              ・最新のものだけではなく、過去のツイートを検索する(最大7日前)
              <br />
              ・再生中にいいねやリプライをする <br />
            </Typography>
          </CardContent>
        </Card>
      );
    }),
  ];
};

export const storeReadNotificationIdList = (keys: string[]) => {
  const userNotifications = getUserNotifications();

  keys.forEach((key) => {
    if (!userNotifications.read.includes(key)) {
      userNotifications.read.push(key);
    }
  });

  const userNotificationsString = JSON.stringify(userNotifications);

  localStorage.setItem(USER_NOTIFICATIONS_STORAGE_KEY, userNotificationsString);
};

export const getReadNotificationIdList = (): string[] => {
  const userNotifications = getUserNotifications();
  return userNotifications.read;
};

const getUserNotifications = (): UserNotificationsInfo => {
  const userNotificationsString = localStorage.getItem(
    USER_NOTIFICATIONS_STORAGE_KEY
  );

  if (userNotificationsString === undefined) {
    return new UserNotificationsInfo();
  }

  const userNotifications = JSON.parse(userNotificationsString);

  return Object.assign(new UserNotificationsInfo(), userNotifications);
};
