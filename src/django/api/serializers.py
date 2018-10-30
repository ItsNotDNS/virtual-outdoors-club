from rest_framework import serializers
from .models import Gear, GearCategory, Reservation


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

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        temp = {"id": rep["id"],
                "email": rep["email"],
                "licenseName": rep["licenseName"],
                "licenseAddress": rep["licenseAddress"],
                "startDate": rep["startDate"],
                "endDate": rep["endDate"],
                "status": rep["status"],
                "gear": rep["gear"]
                }
        return temp
