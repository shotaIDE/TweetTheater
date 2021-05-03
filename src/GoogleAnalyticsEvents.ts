export const registerPageViewEvent = (path: string) => {
  if (!analyticsEnabled) {
    return;
  }
  window.gtag("config", process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: path,
  });
};

export const registerSigninEvent = () => {
  if (!analyticsEnabled) {
    return;
  }
  window.gtag("event", "login", { method: "Twitter" });
};

export const registerOfficialTwitterAccountClickEvent = () => {
  if (!analyticsEnabled) {
    return;
  }
  window.gtag("event", "open_official_twitter");
};

export const registerOpenNotificationEvent = () => {
  if (!analyticsEnabled) {
    return;
  }
  window.gtag("event", "open_notification");
};

export const registerOpenAppStoreEvent = () => {
  if (!analyticsEnabled) {
    return;
  }
  window.gtag("event", "open_app_store");
};

export const registerOpenGooglePlayEvent = () => {
  if (!analyticsEnabled) {
    return;
  }
  window.gtag("event", "open_google_play");
};

const analyticsEnabled = process.env.REACT_APP_GOOGLE_ANALYTICS === "enabled";
