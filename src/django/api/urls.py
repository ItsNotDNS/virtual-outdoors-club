from django.urls import path

from . import views

urlpatterns = [
    path('get-gear-list', views.getGearList, name='get-gear-list'),
    path('get-gear-category-list', views.getGearCategoryList, name='get-gear-category-list'),
]
