from enum import IntEnum, auto

from api.models import UserCredential
from django.conf import settings
from django.http.response import HttpResponse
from firebase_admin import auth

ACCESS_TOKEN_KEY = 'access_token'
ACCESS_SECRET_KEY = 'secret'
CREDENTIALS_SOURCE = 'credentials_source'


class CredentialsSource(IntEnum):
    POST = auto()
    COOKIE = auto()
    DB = auto()


COOKIE_MAX_AGE = 60 * 60 * 24 * 1000  # 1000日


def get_user_secret(request) -> dict:
    uid = get_uid(request=request)

    access_token = request.POST.get('accessToken')
    secret = request.POST.get('secret')

    if (access_token is not None and secret is not None):
        print(
            'User credentials from POST data: '
            f'AccessToken={access_token}, Secret={secret}')

        return {
            ACCESS_TOKEN_KEY: access_token,
            ACCESS_SECRET_KEY: secret,
            CREDENTIALS_SOURCE: CredentialsSource.POST
        }

    # POSTデータに含まれていない場合は、Cookieから秘匿情報を取得する
    access_token = request.COOKIES.get('accessToken')
    secret = request.COOKIES.get('secret')

    if (access_token is not None and secret is not None):
        print(
            'User credentials from Cookie: '
            f'AccessToken={access_token}, Secret={secret}')

        return {
            ACCESS_TOKEN_KEY: access_token,
            ACCESS_SECRET_KEY: secret,
            CREDENTIALS_SOURCE: CredentialsSource.COOKIE
        }

    # POSTデータとCookieに含まれていない場合は、DBから秘匿情報を取得する
    user_credential = UserCredential.objects.get(uid=uid)
    access_token = user_credential.access_token
    secret = user_credential.secret

    print(
        'User credentials from DB: '
        f'AccessToken={access_token}, Secret={secret}')

    return {
        ACCESS_TOKEN_KEY: access_token,
        ACCESS_SECRET_KEY: secret,
        CREDENTIALS_SOURCE: CredentialsSource.DB
    }


def set_user_credentials(response: HttpResponse,
                         access_token: str,
                         access_secret: str):
    response.set_cookie(
        key='accessToken',
        value=access_token,
        max_age=COOKIE_MAX_AGE,
        secure=settings.COOKIE_IS_SECURE,
        httponly=False,
        samesite='None'
    )
    response.set_cookie(
        key='secret',
        value=access_secret,
        max_age=COOKIE_MAX_AGE,
        secure=settings.COOKIE_IS_SECURE,
        httponly=False,
        samesite='None'
    )
    return


def get_uid(request) -> dict:
    id_token = request.POST.get('idToken')

    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token['uid']

    print(f'UID: {uid}')

    return uid
