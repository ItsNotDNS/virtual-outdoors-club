from rest_framework import serializers
from .models import Gear, GearCategory, Reservation, Condition


class GearCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = GearCategory
        fields = [
            "name"
        ]


class ConditionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Condition
        fields = [
            "condition"
        ]


class GearSerializer(serializers.ModelSerializer):
    category = GearCategorySerializer(read_only=True)
    condition = ConditionSerializer(read_only=True)

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
                "condition": rep["condition"]["condition"],
                "version": rep["version"]}
        return temp


class ReservationSerializer(serializers.ModelSerializer):
    gear = GearSerializer(read_only=True, many=True)

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
            "gear",
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        temp = {"id": rep['id'],
                "email": rep['email'],
                "licenseName": rep['licenseName'],
                "licenseAddress": rep['licenseAddress'],
                "startDate": rep['startDate'],
                "endDate": rep['endDate'],
                "status": rep['status'],
                "gear": [rep['gear']]
                }

        return temp
