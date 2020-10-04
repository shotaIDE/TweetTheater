const LOCAL_STORAGE_KEY = "encryptedCredentials";
const POST_KEY = "encryptedCredentials";

export const storeEncryptedCredentials = (json) => {
  if (!(POST_KEY in json)) {
    return;
  }

  const encryptedCredentials = json[POST_KEY];
  localStorage.setItem(LOCAL_STORAGE_KEY, encryptedCredentials);

  console.log(
    `Encrypted credentials: ${encryptedCredentials.substring(0, 10)}...`
  );
};

export const getEncryptedCredentialsParam = (): {} | null => {
  const encryptedCredentials = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (encryptedCredentials == null) {
    return;
  }

  return {
    [POST_KEY]: encryptedCredentials,
  };
};
