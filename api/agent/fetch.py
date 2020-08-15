# coding: utf-8

import json
import os
import urllib.parse

from . import auth


def main(consumer_key: str,
         consumer_secret: str,
         access_token: str,
         access_secret: str,
         gae_hosting: bool = False) -> dict:
    IS_DEBUG = os.environ.get('IS_DEBUG') == 'true'

    cache_path = os.environ.get('CACHE_PATH')
    video_list_path = os.environ.get('VIDEO_LIST_PATH')

    oauth = auth.get_oauth_session(consumer_key=consumer_key,
                                   consumer_secret=consumer_secret,
                                   access_token=access_token,
                                   access_secret=access_secret)

    if IS_DEBUG:
        with open(cache_path, 'r') as f:
            results = json.load(f)
    else:
        search_words = '#深夜の2時間DTM'
        search_words_with_params = search_words \
            + ' exclude:retweets filter:native_video'
        query = urllib.parse.quote(search_words_with_params)

        url = 'https://api.twitter.com/1.1/search/tweets.json?q=' \
            + query \
            + '&result_type=recent&count=100'

        response = oauth.get(url)
        results_text = response.text
        results = json.loads(results_text)

        print("Response: %s" % results)

        if not gae_hosting:
            with open(cache_path, 'w') as f:
                json.dump(results, f, indent=4, ensure_ascii=True)

    video_url_list = []

    for tweet in results['statuses']:
        if 'extended_entities' not in tweet:
            # メディアを直接参照できるURLが含まれていないものはスキップする
            continue

        tweet_id = tweet['id_str']  # 桁の丸め誤差が生じないように文字列のIDを扱う
        created_at = tweet['created_at']
        text = tweet['text']
        favorited = tweet['favorited']

        user_info = tweet['user']
        user_name = user_info['name']
        user_screen_name = user_info['screen_name']
        user_profile_image_url_https = user_info['profile_image_url_https']

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
            'user_display_name': user_name,
            'user_name': user_screen_name,
            'user_profile_image_url': user_profile_image_url_https,
            'favorited': favorited,
        }

        video_url_list.append(extracted_info)

    if not gae_hosting:
        with open(video_list_path, 'w') as f:
            json.dump(video_url_list, f, indent=4, ensure_ascii=True)

    return video_url_list
