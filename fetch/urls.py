from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('callback/', views.callback, name='callback'),
    path('create/', views.create, name='create'),
    path('favorite/', views.post_favorite, name='favorite'),
    path('request/', views.request, name='request'),
]
