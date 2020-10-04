from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    'autoplayclient-dev.uc.r.appspot.com',
    '127.0.0.1',
]

CORS_ORIGIN_ALLOW_ALL = True

WSGI_APPLICATION = 'twitterclient.wsgi.application'
