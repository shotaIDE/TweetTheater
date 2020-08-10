import os
from django.shortcuts import render
from django.http.response import JsonResponse
from fetch.agent import fetch


def index(request):
    consumer_key = os.environ.get('CONSUMER_KEY')
    consumer_secret = os.environ.get('CONSUMER_SECRET')

    access_token = os.environ.get('ACCESS_TOKEN')
    access_token_secret = os.environ.get('ACCESS_TOKEN_SECRET')

    result = fetch.main(consumer_key=consumer_key,
                        consumer_secret=consumer_secret,
                        access_token=access_token,
                        access_token_secret=access_token_secret)

    # 配列をJSONに変換するために、safe を False にしておく
    return JsonResponse(result, safe=False)
