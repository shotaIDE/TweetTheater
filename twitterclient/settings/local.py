import os

import firebase_admin
from firebase_admin import credentials

from .base import *


DEBUG = True

ALLOWED_HOSTS = []

CORS_ORIGIN_ALLOW_ALL = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
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
