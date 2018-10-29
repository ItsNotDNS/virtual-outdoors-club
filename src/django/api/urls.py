from django.conf.urls import url
from .views.GearView import GearView
from .views.GearCategoryView import GearCategoryView
from .views.ReservationView import ReservationView
from .views import PayPalView

urlpatterns = [
    url(r'^gear/?$', GearView.as_view(), name="Gear"),
    url(r'^gear/categories/?$', GearCategoryView.as_view(), name="Gear Category"),
    url(r'^reservation/checkin/?$', ReservationView.as_view(), {"checkin": True}, name="ReservationCheckin"),
    url(r'^reservation/?$', ReservationView.as_view(), {"checkin": False}, name="Reservation"),
    url(r'^process/?$', PayPalView.paypalView, ''),
    url(r'^return/?$', PayPalView.returnView, name="returnView"),
    url(r'^cancel/?$', PayPalView.cancelView, name="cancelView")
]
