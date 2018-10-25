from rest_framework import serializers
from .models import Gear, GearCategory, Reservation


class GearCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = GearCategory
        fields = [
            "name"
        ]


class GearSerializer(serializers.ModelSerializer):
    category = GearCategorySerializer(read_only=True)

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

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        temp = {"id": rep["id"],
                "code": rep["code"],
                "category": rep["category"]["name"],
                "depositFee": rep["depositFee"],
                "description": rep["description"],
                "condition": rep["condition"],
                "version": rep["version"]}
        return temp


class ReservationSerializer(serializers.ModelSerializer):
    gear = GearSerializer(many=True, read_only=True)

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
