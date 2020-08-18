import os

import firebase_admin
from firebase_admin import credentials

from .base import *


DEBUG = False

ALLOWED_HOSTS = [
    'tweet-theater.uc.r.appspot.com',
]

CORS_ORIGIN_ALLOW_ALL = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '/cloudsql/tweet-theater:us-central1:tweet-theater-instance',
        'NAME': os.environ.get('DJANGO_DATABASE_NAME'),
        'USER': os.environ.get('DJANGO_DATABASE_USER_NAME'),
        'PASSWORD': os.environ.get('DJANGO_DATABASE_PASSWORD'),
    }
}

os.environ.setdefault(
    'GOOGLE_APPLICATION_CREDENTIALS',
    str(BASE_DIR / 'serviceAccountKey-Prod.json'))

firebase_admin_credential_path = \
    os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
firebase_admin_credentials = credentials.Certificate(
    firebase_admin_credential_path)
firebase_admin.initialize_app(firebase_admin_credentials)

WSGI_APPLICATION = 'twitterclient.wsgi_prod.application'
