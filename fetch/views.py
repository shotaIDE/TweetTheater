import os

from django.conf import settings
from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import auth

from fetch.agent import favorite, fetch
from fetch.models import UserCredential


ACCESS_TOKEN_KEY = 'access_token'
ACCESS_SECRET_KEY = 'secret'


def _get_user_secret(request) -> dict:
    uid = request.POST.get('uid')
    access_token = request.POST.get('accessToken')
    secret = request.POST.get('secret')

    if (uid is None or access_token is None or secret is None):
        id_token = request.POST.get('idToken')

        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        print(f'uid: {uid}')

        user_credential = UserCredential.objects.get(uid=uid)
        access_token = user_credential.access_token
        secret = user_credential.secret

        print(f'User credentials: AccessToken={access_token}, Secret={secret}')

    return {
        ACCESS_TOKEN_KEY: access_token,
        ACCESS_SECRET_KEY: secret
    }


@csrf_exempt
def index(request):
    consumer_key = settings.TWITTER_CONSUMER_KEY
    consumer_secret = settings.TWITTER_CONSUMER_SECRET

    user_secret = _get_user_secret(request)
    access_token = user_secret[ACCESS_TOKEN_KEY]
    access_secret = user_secret[ACCESS_SECRET_KEY]

    result = fetch.main(
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token=access_token,
        access_secret=access_secret)

    # 配列をJSONに変換するために、safe を False にしておく
    return JsonResponse(result, safe=False)


@csrf_exempt
def create(request):
    uid = request.POST.get('uid')
    access_token = request.POST.get('accessToken')
    secret = request.POST.get('secret')

    print(
        'User accound was created: '
        f'UID={uid}, AccessToken={access_token}, Secret={secret}')

    user_credential = UserCredential(
        uid=uid, access_token=access_token, secret=secret)

    user_credential.save()

    user_credential_id = user_credential.id

    print(f'User credential was stored: ID={user_credential_id}')

    return JsonResponse({})


@csrf_exempt
def post_favorite(request):
    consumer_key = settings.TWITTER_CONSUMER_KEY
    consumer_secret = settings.TWITTER_CONSUMER_SECRET

    target_id = request.POST.get('id')

    user_secret = _get_user_secret(request)
    access_token = user_secret[ACCESS_TOKEN_KEY]
    access_secret = user_secret[ACCESS_SECRET_KEY]

    result = favorite.post(
        id=target_id,
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token=access_token,
        access_secret=access_secret)

    if result == favorite.PostResult.SUCCEED:
        return JsonResponse({})

    if result == favorite.PostResult.ALREADY_FAVORITED:
        return JsonResponse(
            {
                'code': 139,
                'message': 'already favorited'
            })

    return HttpResponse(status=403)
