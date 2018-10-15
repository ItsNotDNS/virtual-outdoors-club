from django.conf.urls import url
from .views import GearView, GearCategoryView

urlpatterns = [
    url(r'^gear/?$', GearView.as_view(), name="Gear"),
    url(r'^gear/categories/?$', GearCategoryView.as_view(), name="Gear Category")
]
