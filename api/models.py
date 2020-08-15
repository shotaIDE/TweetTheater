from django.db import models


class UserCredential(models.Model):
    uid = models.CharField(primary_key=True, unique=True, max_length=28)
    access_token = models.CharField(max_length=50)
    secret = models.CharField(max_length=45)