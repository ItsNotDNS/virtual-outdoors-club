from django.contrib import admin
from .models import Gear, GearCategory, Reservation

# Register your models here.
admin.site.register(Gear)
admin.site.register(GearCategory)
admin.site.register(Reservation)
