# coding: utf-8

import json
import os
from requests_oauthlib import OAuth1Session

IS_DEBUG = os.environ.get('IS_DEBUG') == 'true'

consumer_key = os.environ.get('CONSUMER_KEY')
consumer_secret = os.environ.get('CONSUMER_SECRET')

access_token = os.environ.get('ACCESS_TOKEN')
access_token_secret = os.environ.get('ACCESS_TOKEN_SECRET')

cache_path = os.environ.get('CACHE_PATH')
video_list_path = os.environ.get('VIDEO_LIST_PATH')

params = {"ids": "1138505981460193280", "tweet.fields": "created_at"}

# Make the request
oauth = OAuth1Session(consumer_key,
                      client_secret=consumer_secret,
                      resource_owner_key=access_token,
                      resource_owner_secret=access_token_secret)

if IS_DEBUG:
    with open(cache_path, 'r') as f:
        results = json.load(f)
else:
    url = 'https://api.twitter.com/1.1/search/tweets.json?q=%23%E6%B7%B1%E5%A4%9C%E3%81%AE2%E6%99%82%E9%96%93DTM&result_type=recent&count=100'

    response = oauth.get(url, params=params)
    results_text = response.text
    results = json.loads(results_text)

    print("Response: %s" % results)

    with open(cache_path, 'w') as f:
        json.dump(results, f, indent=4, ensure_ascii=True)

video_url_list = []

for tweet in results['statuses']:
    if 'extended_entities' not in tweet:
        continue

    extended_entities = tweet['extended_entities']
    media_list = extended_entities['media']

    media = media_list[0]

    video_info = media['video_info']
    variants = video_info['variants']

    minimum_bitrate = -1
    minimum_bitrate_url = ''

    for variant in variants:
        if variant['content_type'] != 'video/mp4':
            continue

        media_bitrate = variant['bitrate']
        media_url = variant['url']

        if minimum_bitrate == -1 or minimum_bitrate > media_bitrate:
            minimum_bitrate = minimum_bitrate = media_bitrate
            minimum_bitrate_url = media_url

    video_url_list.append(minimum_bitrate_url)

print(video_url_list)

with open(video_list_path, 'w') as f:
    json.dump(video_url_list, f, indent=4, ensure_ascii=True)
