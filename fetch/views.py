import os
from django.shortcuts import render
from django.http.response import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from fetch.agent import fetch
from fetch.agent import auth


@csrf_exempt
def index(request):
    consumer_key = os.environ.get('CONSUMER_KEY')
    consumer_secret = os.environ.get('CONSUMER_SECRET')

    access_token = request.POST.get('token')
    access_token_secret = request.POST.get('secret')
    # access_token = os.environ.get('ACCESS_TOKEN')
    # access_token_secret = os.environ.get('ACCESS_TOKEN_SECRET')

    result = fetch.main(consumer_key=consumer_key,
                        consumer_secret=consumer_secret,
                        access_token=access_token,
                        access_token_secret=access_token_secret)

    # 配列をJSONに変換するために、safe を False にしておく
    return JsonResponse(result, safe=False)


def request(request):
    consumer_key = os.environ.get('CONSUMER_KEY')
    consumer_secret = os.environ.get('CONSUMER_SECRET')

    authenticate_url = auth.get_authenticate_request_url(
            consumer_key=consumer_key, consumer_secret=consumer_secret)

    return redirect(authenticate_url)


def callback(request):
    consumer_key = os.environ.get('CONSUMER_KEY')
    consumer_secret = os.environ.get('CONSUMER_SECRET')

    oauth_token = request.GET.get('oauth_token')
    oauth_verifier = request.GET.get('oauth_verifier')

    print(f'OAuth Token: {oauth_token}')
    print(f'OAuth Verifier: {oauth_verifier}')

    access_token = auth.get_access_token(
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        oauth_token=oauth_token,
        oauth_verifier=oauth_verifier)

    return JsonResponse(access_token)
