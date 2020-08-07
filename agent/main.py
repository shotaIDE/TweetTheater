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


def get_oauth_session():
    consumer_key = os.environ.get('CONSUMER_KEY')
    consumer_secret = os.environ.get('CONSUMER_SECRET')

    access_token = os.environ.get('ACCESS_TOKEN')
    access_token_secret = os.environ.get('ACCESS_TOKEN_SECRET')

    params = {"ids": "1138505981460193280", "tweet.fields": "created_at"}

    # Make the request
    oauth = OAuth1Session(consumer_key,
                          client_secret=consumer_secret,
                          resource_owner_key=access_token,
                          resource_owner_secret=access_token_secret)

    return oauth


# いいねを登録する
def post_favorite(id: int):
    oauth = get_oauth_session()

    url = 'https://api.twitter.com/1.1/favorites/create.json'
    params = {
        'id': id,
    }

    response = oauth.post(url, params=params)
    results_text = response.text
    results = json.loads(results_text)

    print(results)


def main():
    IS_DEBUG = os.environ.get('IS_DEBUG') == 'true'

    cache_path = os.environ.get('CACHE_PATH')
    video_list_path = os.environ.get('VIDEO_LIST_PATH')

    oauth = get_oauth_session()

    if IS_DEBUG:
        with open(cache_path, 'r') as f:
            results = json.load(f)
    else:
        url = 'https://api.twitter.com/1.1/search/tweets.json?q=%23%E6%B7%B1%E5%A4%9C%E3%81%AE2%E6%99%82%E9%96%93DTM&result_type=recent&count=100'

        response = oauth.get(url)
        results_text = response.text
        results = json.loads(results_text)

        print("Response: %s" % results)

        with open(cache_path, 'w') as f:
            json.dump(results, f, indent=4, ensure_ascii=True)

    video_url_list = []

    for tweet in results['statuses']:
        if 'extended_entities' not in tweet:
            continue

        tweet_id = tweet['id']
        created_at = tweet['created_at']
        text = tweet['text']

        extended_entities = tweet['extended_entities']
        media_list = extended_entities['media']

        media = media_list[0]

        detail_url = media['url']
        video_info = media['video_info']
        variants = video_info['variants']

        maximum_bitrate = -1
        maximum_bitrate_url = ''

        for variant in variants:
            if variant['content_type'] != 'video/mp4':
                continue

            media_bitrate = variant['bitrate']
            media_url = variant['url']

            if maximum_bitrate < media_bitrate:
                maximum_bitrate = media_bitrate
                maximum_bitrate_url = media_url

        extracted_info = {
            'id': tweet_id,
            'created_at': created_at,
            'text': text,
            'detail_url': detail_url,
            'video_url': maximum_bitrate_url,
        }

        video_url_list.append(extracted_info)

    with open(video_list_path, 'w') as f:
        json.dump(video_url_list, f, indent=4, ensure_ascii=True)


if __name__ == "__main__":
    main()
