import os

from .base import *


DEBUG = False

ALLOWED_HOSTS = [
    'tweet-theater.uc.r.appspot.com',
]

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

COOKIE_IS_SECURE = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '/cloudsql/tweet-theater:us-central1:tweet-theater-instance',
        'NAME': os.environ.get('DJANGO_DATABASE_NAME'),
        'USER': os.environ.get('DJANGO_DATABASE_USER_NAME'),
        'PASSWORD': os.environ.get('DJANGO_DATABASE_PASSWORD'),
    }
}

WSGI_APPLICATION = 'twitterclient.wsgi_prod.application'
