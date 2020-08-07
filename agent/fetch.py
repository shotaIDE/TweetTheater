# coding: utf-8

import json
import os
from auth import get_oauth_session


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
            # メディアが含まれていないものはスキップする
            continue

        if 'retweeted_status' in tweet:
            # リツイートはスキップする
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
