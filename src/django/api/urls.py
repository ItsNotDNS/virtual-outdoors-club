from django.urls import path

from . import views

urlpatterns = [
    path('add-gear-to-list', views.GearView.post, name='add-gear-to-list'),
    path('get-gear-category-list', views.getGearCategoryList, name='get-gear-category-list'),
    path('get-gear-list', views.GearView.get, name='get-gear-list'),
]
