from rest_framework import serializers
from .models import Gear, GearCategory


class GearCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = GearCategory
        fields = ('categoryID', 'categoryDescription', 'symbol')


class GearSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gear
        fields = ('gearID', 'gearCode', 'gearType', 'available', 'depositFee', 'gearDescription')

    def to_representation(self, instance):
        self.fields['gearType'] = GearCategorySerializer(read_only=True)
        return super().to_representation(instance)
