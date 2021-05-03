import { Card, CardContent, Grid, Link, makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";

const USER_NOTIFICATIONS_STORAGE_KEY = "userNotifications";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  pos: {
    fontSize: 14,
    marginBottom: 12,
  },
});

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
      const classes = useStyles();

      return (
        <Card variant="outlined" className={classes.root}>
          <CardContent>
            <Typography
              variant="h6"
              component="h2"
              color={read ? "textSecondary" : "textPrimary"}
            >
              スマホアプリ版がリリースされました！
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              2021年5月3日 19:00
            </Typography>
            <Typography
              variant="body2"
              component="p"
              color={read ? "textSecondary" : "textPrimary"}
            >
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
            <Typography
              variant="body2"
              component="p"
              color={read ? "textSecondary" : "textPrimary"}
            >
              本サイトのWeb版の機能に加えて、以下の機能が追加されました！
              <br />
              <br />
              ・深夜の2時間DTM以外の好きなキーワードで検索
              <br />
              ・いいねやリプライ <br />
              ・プレイリスト保存による再生位置の復元
              <br />
            </Typography>
          </CardContent>
        </Card>
      );
    }),
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
