from django.shortcuts import render
from django.http.response import JsonResponse

# Create your views here.


def index(request):
    result = {
        'test': 'ああああ',
        'test2': 'The trouble thing.',
    }
    return JsonResponse(result)
