import os

import firebase_admin
from django.conf import settings
from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import auth as firebaseauth
from firebase_admin import credentials, firestore

from fetch.agent import favorite, fetch

firebase_admin_credential_path = \
    os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
cred = credentials.Certificate(firebase_admin_credential_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

ACCESS_TOKEN_KEY = 'access_token'
ACCESS_SECRET_KEY = 'secret'


def _get_user_secret(request) -> dict:
    uid = request.POST.get('uid')
    access_token = request.POST.get('accessToken')
    secret = request.POST.get('secret')

    if (uid is None or access_token is None or secret is None):
        id_token = request.POST.get('idToken')

        decoded_token = firebaseauth.verify_id_token(id_token)
        uid = decoded_token['uid']

        print(f'uid: {uid}')

        user_document_ref = db.collection('credentials').document(uid)
        user_credentials_raw = user_document_ref.get()
        user_credentials = user_credentials_raw.to_dict()

        print(f'User credentials: {user_credentials}')

        access_token = user_credentials['accessToken']
        secret = user_credentials['secret']

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
    access_secret = request.POST.get('secret')

    print(f'uid: {uid}')

    user_document_ref = db.collection('credentials').document(uid)

    user_credentials = {
        'accessToken': access_token,
        'secret': access_secret,
    }

    user_document_ref.set(user_credentials)

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
