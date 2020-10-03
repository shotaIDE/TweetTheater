from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    'tweet-theater.uc.r.appspot.com',
]

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

COOKIE_IS_SECURE = True

WSGI_APPLICATION = 'twitterclient.wsgi_prod.application'
