from enum import IntEnum, auto

from django.conf import settings
from firebase_admin import auth

from . import crypto

UID_KEY = 'uid'
ACCESS_TOKEN_KEY = 'access_token'
ACCESS_SECRET_KEY = 'secret'
CREDENTIALS_SOURCE = 'credentials_source'


class CredentialsSource(IntEnum):
    POST = auto()
    COOKIE = auto()
    DB = auto()


_COOKIE_MAX_AGE = 60 * 60 * 24 * 1000  # 1000日

_POST_ACCESS_TOKEN_KEY = 'accessToken'
_POST_ACCESS_SECRET_KEY = 'secret'

_DB_JSON_ACCESS_TOKEN_KEY = 'token'
_DB_JSON_ACCESS_SECRET_KEY = 'secret'

_ENCRYPTED_CREDENTIALS_KEY = 'encryptedCredentials'


def get_credentials_on_create(request) -> dict:
    uid = _get_uid(request=request)

    credentials = _get_credentials_from_post(request=request)

    credentials[UID_KEY] = uid

    return credentials


def get_credentials(request) -> dict:
    uid = _get_uid(request=request)

    credentials = _get_credentials_from_post(request=request)

    if credentials is not None:
        credentials[CREDENTIALS_SOURCE] = CredentialsSource.POST
        return credentials

    # POSTに直接含まれていない場合は、POSTから復号化して秘匿情報を取得する
    credentials = _get_decrypted_credentials_from_post(request=request)

    if credentials is not None:
        credentials[CREDENTIALS_SOURCE] = CredentialsSource.COOKIE
        return credentials

    # POSTに含まれていない場合は、DBから秘匿情報を取得する(レガシー)
    credentials = _get_credentials_from_db(uid=uid)

    credentials[CREDENTIALS_SOURCE] = CredentialsSource.DB
    return credentials


def get_encrypted_credentials(access_token: str, access_secret: str) -> dict:
    cipher = crypto.AESCipher(key=settings.CREDENTIALS_SECRET_KEY)

    credentials_str = f'{access_token}\n{access_secret}'
    encrypted_credentials = cipher.encrypt(text=credentials_str)

    results = {
        _ENCRYPTED_CREDENTIALS_KEY: encrypted_credentials
    }

    return results


def _get_uid(request) -> dict:
    id_token = request.POST.get('idToken')

    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token['uid']

    print(f'UID: {uid}')

    return uid


def _get_credentials_from_post(request) -> dict:
    access_token = request.POST.get(_POST_ACCESS_TOKEN_KEY)
    access_secret = request.POST.get(_POST_ACCESS_SECRET_KEY)

    if (access_token is not None and access_secret is not None):
        print(
            'User credentials (raw) from POST data: '
            f'AccessToken={access_token}, Secret={access_secret}')

        return {
            ACCESS_TOKEN_KEY: access_token,
            ACCESS_SECRET_KEY: access_secret,
        }

    return


def _get_decrypted_credentials_from_post(request) -> dict:
    encrypted_credentials = request.POST.get(_ENCRYPTED_CREDENTIALS_KEY)

    if encrypted_credentials is None:
        return

    cipher = crypto.AESCipher(key=settings.CREDENTIALS_SECRET_KEY)

    credentials_str = cipher.decrypt(text=encrypted_credentials)
    parsed_credentials = credentials_str.split('\n')
    access_token = parsed_credentials[0]
    access_secret = parsed_credentials[1]

    if (access_token is not None and access_secret is not None):
        print(
            'User credentials (encrypted) from POST: '
            f'AccessToken={access_token}, Secret={access_secret}')

        return {
            ACCESS_TOKEN_KEY: access_token,
            ACCESS_SECRET_KEY: access_secret,
        }

    return


def _get_credentials_from_db(uid: str) -> dict:
    user_credential = settings.USER_CREDENTIALS[uid]
    access_token = user_credential[_DB_JSON_ACCESS_TOKEN_KEY]
    access_secret = user_credential[_DB_JSON_ACCESS_SECRET_KEY]

    print(
        'User credentials from DB: '
        f'AccessToken={access_token}, Secret={access_secret}')

    return {
        ACCESS_TOKEN_KEY: access_token,
        ACCESS_SECRET_KEY: access_secret,
    }
