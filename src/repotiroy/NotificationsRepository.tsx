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
        <div>
          <Typography variant="body1">
            スマホアプリ版がリリースされました！
          </Typography>
          <Typography variant="body2">
            アプリ版がご利用可能になりました！
          </Typography>
          <Typography variant="caption">2021年5月3日 19:00</Typography>
        </div>
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
