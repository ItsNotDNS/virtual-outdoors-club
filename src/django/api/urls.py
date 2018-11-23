from django.conf.urls import url
from .views.GearCategoryView import GearCategoryView
from .views import GearView, PayPalView, ReservationView, UserVariabilityView, MemberView, BlackListView


urlpatterns = [
    url(r'^gear/?$', GearView.GearView.as_view(), name="Gear"),
    url(r'^gear/history/?$', GearView.getHistory, name="Gear History"),
    url(r'^gear/categories/?$', GearCategoryView.as_view(), name="Gear Category"),
    url(r'^reservation/?$', ReservationView.ReservationView.as_view(), name="Reservation"),
    url(r'^reservation/history/?$', ReservationView.getHistory, name="Reservation History"),
    url(r'^reservation/checkout/?$', ReservationView.checkout, name="reservationCheckout"),
    url(r'^reservation/checkin/?$', ReservationView.checkin, name="reservationCheckin"),
    url(r'^reservation/cancel/?$', ReservationView.cancel, name="reservationCancel"),
    url(r'^reservation/approve/?$', ReservationView.approve, name="reservationApprove"),
    url(r'^process/?$', PayPalView.paypalView, name="PayPalView"),
    url(r'^return/?$', PayPalView.returnView, name="returnView"),
    url(r'^cancel/?$', PayPalView.cancelView, name="cancelView"),
    url(r'^system/variability/?$', UserVariabilityView.UserVariabilityView.as_view(), name="updateValues"),
    url(r'^system/accounts/?$', UserVariabilityView.changePassword, name="changePassword"),
    url(r'^members/blacklist/?$', BlackListView.BlackListView.as_view(), name="BlackList"),
    url(r'^members/?$', MemberView.MemberView.as_view(), name="Members"),
]
