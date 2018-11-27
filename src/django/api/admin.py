from django.contrib import admin
from .models import Gear, GearCategory, Reservation, UserVariability, Member, BlackList, GearStat

# Register your models here.
admin.site.register(Gear)
admin.site.register(GearStat)
admin.site.register(GearCategory)
admin.site.register(Reservation)
admin.site.register(UserVariability)
admin.site.register(BlackList)
admin.site.register(Member)

