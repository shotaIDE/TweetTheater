from django.urls import path

from . import views

urlpatterns = [
    path('search/', views.search, name='index'),
    path('user/create', views.create_user, name='create_user'),
    path('favorite/create', views.create_favorite, name='create_favorite'),
]
