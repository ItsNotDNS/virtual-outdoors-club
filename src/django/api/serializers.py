from rest_framework import serializers
from .models import Gear, GearCategory, Reservation
from datetime import datetime


class GearCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = GearCategory
        fields = [
            "name"
        ]


class GearSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(queryset=GearCategory.objects.all(), slug_field='name')

    class Meta:
        model = Gear
        fields = [
            "id",
            "code",
            "category",
            "depositFee",
            "description",
            "condition",
            "version"
        ]


class ReservationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reservation
        fields = [
            "id",
            "email",
            "licenseName",
            "licenseAddress",
            "startDate",
            "endDate",
            "status",
            "gear"
        ]

    def validate_gear(self, attrs):
        denied = []
        for gear in attrs:
            if Reservation.objects.filter(gear=gear).count():
                denied.append(gear.pk)

        if len(denied) != 0:
            message = ""
            for item in denied:
                message += str(item)
                message += ", "
            raise serializers.ValidationError("These items are unavailable: " + message[:-2])

        return attrs

    def validate(self, data):
        if data['startDate'] < datetime.now().date():
            raise serializers.ValidationError("Start date must be in the future.")

        if data['startDate'] > data['endDate']:
            raise serializers.ValidationError("Start date must be before the end date")

        return data
