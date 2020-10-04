from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    'tweet-theater.uc.r.appspot.com',
]

CORS_ORIGIN_ALLOW_ALL = True

WSGI_APPLICATION = 'twitterclient.wsgi_prod.application'
