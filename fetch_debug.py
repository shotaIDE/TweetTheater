# coding: utf-8

import os
from fetch.agent import fetch

if __name__ == "__main__":
    consumer_key = os.environ.get('CONSUMER_KEY')
    consumer_secret = os.environ.get('CONSUMER_SECRET')

    access_token = os.environ.get('ACCESS_TOKEN')
    access_secret = os.environ.get('ACCESS_TOKEN_SECRET')

    fetch.main(consumer_key=consumer_key,
               consumer_secret=consumer_secret,
               access_token=access_token,
               access_secret=access_secret)
