# coding: utf-8

import json
import os
from enum import Enum

from requests_oauthlib import OAuth1Session

from . import auth


class PostResult(Enum):
    SUCCEED = "Succeed"
    UNKNOWN_ERROR = "Unknown error"
    ALREADY_FAVORITED = "Already favorited"


# いいねを登録する
def __post_favorite(id: int, oauth: OAuth1Session) -> PostResult:
    url = 'https://api.twitter.com/1.1/favorites/create.json'
    params = {
        'id': id,
    }

    response = oauth.post(url, params=params)
    response_code = response.status_code
    results_text = response.text
    results = json.loads(results_text)

    print(f'Code: {response_code}, result: {results}')

    if response_code == 200:
        return PostResult.SUCCEED

    if response_code == 403 and results['errors'][0]['code'] == 139:
        return PostResult.ALREADY_FAVORITED

    return PostResult.UNKNOWN_ERROR


def create(id: str,
           consumer_key: str,
           consumer_secret: str,
           access_token: str,
           access_secret: str) -> PostResult:
    oauth = auth.get_oauth_session(consumer_key=consumer_key,
                                   consumer_secret=consumer_secret,
                                   access_token=access_token,
                                   access_secret=access_secret)

    return __post_favorite(id=id, oauth=oauth)


def post_at_once(consumer_key: str,
                 consumer_secret: str,
                 access_token: str,
                 access_secret: str):
    start_str = input(
        'Enter the first number of the tweet you want to like...')
    start = int(start_str) - 1

    end_str = input('Enter the last number of the tweet you want to like...')
    end = int(end_str)

    video_list_path = os.environ.get('VIDEO_LIST_PATH')

    with open(video_list_path, 'r') as f:
        video_url_list = json.load(f)

    oauth = auth.get_oauth_session(consumer_key=consumer_key,
                                   consumer_secret=consumer_secret,
                                   access_token=access_token,
                                   access_secret=access_secret)

    for video_info in video_url_list[start:end]:
        tweet_id = video_info['id']
        __post_favorite(id=tweet_id, oauth=oauth)
