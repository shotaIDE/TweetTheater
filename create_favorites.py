# coding: utf-8

import os

from api.twitter import favorite

if __name__ == "__main__":
    consumer_key = os.environ.get('TWITTER_CONSUMER_KEY')
    consumer_secret = os.environ.get('TWITTER_CONSUMER_SECRET')

    access_token = os.environ.get('TWITTER_USER_ACCESS_TOKEN')
    access_secret = os.environ.get('TWITTER_USER_SECRET')

    favorite.create_at_once(
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token=access_token,
        access_secret=access_secret)
