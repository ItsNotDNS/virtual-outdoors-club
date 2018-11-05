from django.conf.urls import url
from .views.GearView import GearView
from .views.GearCategoryView import GearCategoryView
from .views import PayPalView, ReservationView, UserVariabilityView, MemberView

urlpatterns = [
    url(r'^gear/?$', GearView.as_view(), name="Gear"),
    url(r'^gear/categories/?$', GearCategoryView.as_view(), name="Gear Category"),
    url(r'^reservation/?$', ReservationView.ReservationView.as_view(), name="Reservation"),
    url(r'^reservation/checkin/?$', ReservationView.checkin, name="reservationCheckin"),
    url(r'^reservation/cancel/?$', ReservationView.cancel, name="reservationCancel"),
    url(r'^process/?$', PayPalView.paypalView, ''),
    url(r'^return/?$', PayPalView.returnView, name="returnView"),
    url(r'^cancel/?$', PayPalView.cancelView, name="cancelView"),
    url(r'^userVar/updateMaxReservation/?$', UserVariabilityView.updateMaxReservation, name="updateMaxReservation"),
    url(r'^members/?$', MemberView.MemberView.as_view(), name="Members")
]
