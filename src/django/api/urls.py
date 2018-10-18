from django.conf.urls import url
from .views.GearView import GearView
from .views.GearCategoryView import GearCategoryView
from .views.ReservationView import ReservationView

urlpatterns = [
    url(r'^gear/?$', GearView.as_view(), name="Gear"),
    url(r'^gear/categories/?$', GearCategoryView.as_view(), name="Gear Category"),
    url(r'^reservation/?$', ReservationView.as_view(), name="Reservation")
]
