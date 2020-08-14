import os

from .base import *


DEBUG = False

ALLOWED_HOSTS = [
    'autoplayclient-dev.uc.r.appspot.com',
    '127.0.0.1',
]

CORS_ORIGIN_ALLOW_ALL = True

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
