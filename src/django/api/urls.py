from django.urls import path

from . import views

urlpatterns = [
    path('get-gear-list', views.getGearList, name='get-gear-list'),
]