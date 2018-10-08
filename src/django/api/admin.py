from django.contrib import admin
from .models import Gear
from .models import GearCategory

# Register your models here.
admin.site.register(Gear)
admin.site.register(GearCategory)
