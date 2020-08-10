# coding: utf-8

import json
import os
from requests_oauthlib import OAuth1Session
from urllib.parse import parse_qsl


def auth_application():
    consumer_key = os.environ.get('CONSUMER_KEY')
    consumer_secret = os.environ.get('CONSUMER_SECRET')

    oauth = OAuth1Session(consumer_key,
                          client_secret=consumer_secret)

    url = 'https://api.twitter.com/oauth/request_token'

    params = {
        'oauth_callback': 'https://www.google.co.jp/',
    }

    response = oauth.post(url, params=params)

    request_token_info = dict(parse_qsl(response.content.decode("utf-8")))
    request_token = request_token_info['oauth_token']
    request_token_secret = request_token_info['oauth_token_secret']

    print(f'Request token: {request_token_info}')

    authenticate_url = f'https://api.twitter.com/oauth/authenticate?oauth_token={request_token}'

    print(f'Please allow this application to access your account: {authenticate_url}')

    oauth_token = input('Please type OAuth token...')
    oauth_verifier = input('Please type OAuth verifier...')

    twitter = OAuth1Session(
        consumer_key,
        consumer_secret,
        oauth_token,
        oauth_verifier,
    )

    access_token_url = 'https://api.twitter.com/oauth/access_token'

    response = twitter.post(
        access_token_url,
        params={'oauth_verifier': oauth_verifier}
    )

    # responseからアクセストークンを取り出す
    access_token_info = dict(parse_qsl(response.content.decode("utf-8")))
    access_token = access_token_info['oauth_token']
    access_token_secret = access_token_info['oauth_token_secret']

    print('Access Token =====')
    print(f"ACCESS_TOKEN='{access_token}'")
    print(f"ACCESS_TOKEN_SECRET='{access_token_secret}'")


def get_oauth_session(consumer_key: str,
                      consumer_secret: str,
                      access_token: str,
                      access_token_secret: str) -> OAuth1Session:
    # Make the request
    oauth = OAuth1Session(consumer_key,
                          client_secret=consumer_secret,
                          resource_owner_key=access_token,
                          resource_owner_secret=access_token_secret)

    return oauth
