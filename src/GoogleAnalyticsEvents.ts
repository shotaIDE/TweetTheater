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

const analyticsEnabled = process.env.REACT_APP_GOOGLE_ANALYTICS === "enabled";
