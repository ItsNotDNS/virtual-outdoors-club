from django.contrib import admin
from .models import Gear, GearCategory, Reservation, UserVariability

# Register your models here.
admin.site.register(Gear)
admin.site.register(GearCategory)
admin.site.register(Reservation)
admin.site.register(UserVariability)
