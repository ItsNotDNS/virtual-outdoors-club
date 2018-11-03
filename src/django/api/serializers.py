from rest_framework import serializers
from .models import Gear, GearCategory, Reservation, UserVariability
from datetime import datetime
from django.db.models import Q


class UserVariabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserVariability
        fields = [
            "variable",
            "value",
        ]


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

    def validate(self, data):
        if data['startDate'] < datetime.now().date():
            raise serializers.ValidationError("Start date must be in the future.")

        if data['startDate'] > data['endDate']:
            raise serializers.ValidationError("Start date must be before the end date")
        
        try:
            maxResvTime = UserVariability.objects.get(pk="maxReservationDays") 
        except:
            maxResvTime = 14

        if (data['endDate'] - data['startDate']).days > maxResvTime:
            raise serializers.ValidationError("Length of reservation must be less than " + str(maxResvTime))
        
        denied = []
        dateFilter = Q(startDate__range=[data['startDate'], data['endDate']]) | \
                     Q(endDate__range=[data['startDate'], data['endDate']]) | \
                     Q(startDate__lte=data['startDate'], endDate__gte=data['endDate'])

        overlappingRes = Reservation.objects.filter(dateFilter)

        for gear in data['gear']:
            if overlappingRes.filter(gear=gear).exists():
                denied.append(gear.pk)

        if len(denied) != 0:
            message = ""
            for item in denied:
                message += str(item)
                message += ", "
            raise serializers.ValidationError("These items are unavailable: " + message[:-2])

        return data
