import { Card, CardContent, Grid, Link } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";

const USER_NOTIFICATIONS_STORAGE_KEY = "userNotifications";

export class Notification {
  id: string;
  body: JSX.Element;

  constructor(id: string, body: JSX.Element) {
    this.id = id;
    this.body = body;
  }
}

class UserNotificationsInfo {
  read: string[] = [];
}

export const getNotifications = (): Notification[] => {
  return [
    new Notification(
      "001",
      (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              スマホアプリ版がリリースされました！
            </Typography>
            <Typography color="textSecondary">2021年5月3日 19:00</Typography>
            <Typography variant="body2" component="p">
              深夜の2時間DTMの自動再生ツールの、スマホアプリ版がリリースされました！
              <br />
            </Typography>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Link href="https://apps.apple.com/jp/app/tweet-theater/id1545902971">
                <img
                  height={48}
                  style={{ margin: "10px" }}
                  src="Download_on_the_App_Store_Badge_JP_RGB_blk_100317.svg"
                  alt="App Storeで手に入れる"
                />
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=ide.shota.colomney.tweet_theater&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                <img
                  height={70}
                  alt="Google Play で手に入れよう"
                  src="https://play.google.com/intl/ja/badges/static/images/badges/ja_badge_web_generic.png"
                />
              </Link>
            </Grid>
            <Typography variant="body2" component="p">
              本サイトのWeb版の機能に加えて、以下の機能が追加されました！
              <ul>
                <li>深夜の2時間DTM以外の好きなキーワードで検索</li>
                <li>いいねやリプライ</li>
                <li>プレイリスト保存による再生位置の復元</li>
              </ul>
            </Typography>
          </CardContent>
        </Card>
      )
    ),
  ];
};

export const storeReadNotification = (key: string) => {
  const userNotifications = getUserNotifications();

  if (!(key in userNotifications.read)) {
    userNotifications.read.push(key);
  }

  const userNotificationsString = JSON.stringify(userNotifications);

  localStorage.setItem(USER_NOTIFICATIONS_STORAGE_KEY, userNotificationsString);

  console.log(
    `User notifications: ${userNotificationsString.substring(0, 10)}...`
  );
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
