import os

from django.conf import settings
from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import auth

from api.twitter import favorite, search
from api.models import UserCredential


ACCESS_TOKEN_KEY = 'access_token'
ACCESS_SECRET_KEY = 'secret'


def _get_uid(request) -> dict:
    id_token = request.POST.get('idToken')

    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token['uid']

    print(f'UID: {uid}')

    return uid


def _get_user_secret(request) -> dict:
    uid = _get_uid(request=request)

    access_token = request.POST.get('accessToken')
    secret = request.POST.get('secret')

    if (access_token is None or secret is None):
        # リクエストに含まれていない場合は、DBから秘匿情報を取得する
        user_credential = UserCredential.objects.get(uid=uid)
        access_token = user_credential.access_token
        secret = user_credential.secret

        print(f'User credentials: AccessToken={access_token}, Secret={secret}')

    return {
        ACCESS_TOKEN_KEY: access_token,
        ACCESS_SECRET_KEY: secret
    }


@csrf_exempt
def search_2hDTM(request):
    consumer_key = settings.TWITTER_CONSUMER_KEY
    consumer_secret = settings.TWITTER_CONSUMER_SECRET

    user_secret = _get_user_secret(request)
    access_token = user_secret[ACCESS_TOKEN_KEY]
    access_secret = user_secret[ACCESS_SECRET_KEY]

    result = search.hashtag_2hDTM(
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token=access_token,
        access_secret=access_secret,
        gae_hosting=settings.GAE_HOSTING)

    # 配列をJSONに変換するために、safe を False にしておく
    return JsonResponse(result, safe=False)


@csrf_exempt
def create_user(request):
    uid = _get_uid(request=request)

    access_token = request.POST.get('accessToken')
    secret = request.POST.get('secret')

    print(
        'User accound was received: '
        f'UID={uid}, AccessToken={access_token}, Secret={secret}')

    defaults_params = {
        'access_token': access_token,
        'secret': secret,
    }

    user_credential, created = UserCredential.objects.update_or_create(
        uid=uid, defaults=defaults_params)

    if created:
        print('User credential was created')
    else:
        print('User credential was updated')

    max_age = 60 * 60 * 24 * 1000  # 1000日

    http_response = HttpResponse()
    http_response.set_cookie(
        key='accessToken',
        value=access_token,
        max_age=max_age,
        secure=settings.COOKIE_IS_SECURE,
        httponly=False,
        samesite='None'
    )
    http_response.set_cookie(
        key='secret',
        value=secret,
        max_age=max_age,
        secure=settings.COOKIE_IS_SECURE,
        httponly=False,
        samesite='None'
    )

    return http_response


@csrf_exempt
def create_favorite(request):
    consumer_key = settings.TWITTER_CONSUMER_KEY
    consumer_secret = settings.TWITTER_CONSUMER_SECRET

    target_id = request.POST.get('id')

    user_secret = _get_user_secret(request)
    access_token = user_secret[ACCESS_TOKEN_KEY]
    access_secret = user_secret[ACCESS_SECRET_KEY]

    result = favorite.create(
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
