from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    'autoplayclient-dev.uc.r.appspot.com',
    '127.0.0.1',
]

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

COOKIE_IS_SECURE = True

WSGI_APPLICATION = 'twitterclient.wsgi.application'
