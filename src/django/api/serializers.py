from rest_framework import serializers
from .models import Gear, GearCategory, Reservation, GearRequest


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
        # should add condition when implemented
        fields = [
            "id",
            "code",
            "category",
            "depositFee",
            "checkedOut",
            "description",
            "version"
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        temp = {"id": rep["id"],
                "code": rep["code"],
                "category": rep["category"]["name"],
                "checkedOut": rep["checkedOut"],
                "depositFee": rep["depositFee"],
                "description": rep["description"],
                "version": rep["version"]}
        return temp


class GearRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = GearRequest
        fields = [
            "id",
            "email",
            "licenseName",
            "licenseAddress",
            "startDate",
            "endDate",
            "status",
        ]


class ReservationSerializer(serializers.ModelSerializer):
    reservationID = GearRequestSerializer(read_only=True)
    gearID = GearSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            "reservationID",
            "gearID"
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rez = rep['reservationID']
        temp = {"id": rez['id'],
                "email": rez['email'],
                "licenseName": rez['licenseName'],
                "licenseAddress": rez['licenseAddress'],
                "startDate": rez['startDate'],
                "endDate": rez['endDate'],
                "status": rez['status'],
                "gear": [rep['gearID']]
                }

        return temp
