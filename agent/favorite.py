# coding: utf-8

import json
import os
from auth import get_oauth_session


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
    end = input('Enter the last number of the tweet you want to like...')

    video_list_path = os.environ.get('VIDEO_LIST_PATH')

    with open(video_list_path, 'r') as f:
        video_url_list = json.load(f)

    for video_info in video_url_list[:end]:
        tweet_id = video_info['id']
        post_favorite(id=tweet_id)

    removed_video_url_list = video_url_list[end:]

    with open(video_list_path, 'w') as f:
        json.dump(removed_video_url_list, f, indent=4, ensure_ascii=True)


if __name__ == "__main__":
    main()
