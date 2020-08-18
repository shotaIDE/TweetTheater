import os

import firebase_admin
from firebase_admin import credentials

from .base import *


DEBUG = False

ALLOWED_HOSTS = [
    'autoplayclient-dev.uc.r.appspot.com',
    '127.0.0.1',
]

CORS_ORIGIN_ALLOW_ALL = True

if GAE_HOSTING:
    # GAE 環境
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'HOST': '/cloudsql/autoplayclient-dev:us-central1:auto-play-client-instance',
            'NAME': os.environ.get('DJANGO_DATABASE_NAME'),
            'USER': os.environ.get('DJANGO_DATABASE_USER_NAME'),
            'PASSWORD': os.environ.get('DJANGO_DATABASE_PASSWORD'),
        }
    }
else:
    # ローカル環境
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'NAME': os.environ.get('DJANGO_DATABASE_NAME'),
            'USER': os.environ.get('DJANGO_DATABASE_USER_NAME'),
            'PASSWORD': os.environ.get('DJANGO_DATABASE_PASSWORD'),
        }
    }

os.environ.setdefault(
    'GOOGLE_APPLICATION_CREDENTIALS',
    str(BASE_DIR / 'serviceAccountKey-Dev.json'))

firebase_admin_credential_path = \
    os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
firebase_admin_credentials = credentials.Certificate(
    firebase_admin_credential_path)
firebase_admin.initialize_app(firebase_admin_credentials)

WSGI_APPLICATION = 'twitterclient.wsgi.application'
