# coding: utf-8

from requests_oauthlib import OAuth1Session


def get_oauth_session(consumer_key: str,
                      consumer_secret: str,
                      access_token: str,
                      access_secret: str) -> OAuth1Session:
    # Make the request
    oauth = OAuth1Session(consumer_key,
                          client_secret=consumer_secret,
                          resource_owner_key=access_token,
                          resource_owner_secret=access_secret)

    return oauth
