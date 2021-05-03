const USER_NOTIFICATIONS_STORAGE_KEY = "userNotifications";

class UserNotificationsInfo {
  read: string[];
}

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

  if (userNotificationsString == null) {
    return new UserNotificationsInfo();
  }

  const userNotifications = JSON.parse(userNotificationsString);

  return Object.assign(new UserNotificationsInfo(), userNotifications);
};
