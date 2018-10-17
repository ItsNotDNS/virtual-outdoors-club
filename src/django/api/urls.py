from django.conf.urls import url
from .views import GearView, GearCategoryView, ReservationView

urlpatterns = [
    url(r'^gear/?$', GearView.as_view(), name="Gear"),
    url(r'^gear/categories/?$', GearCategoryView.as_view(), name="Gear Category"),
    url(r'^reservation/?$', ReservationView.as_view(), name="Reservation")
]
