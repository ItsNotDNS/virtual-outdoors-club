from rest_framework import serializers
from .models import Gear, GearCategory, Reservation, UserVariability, Member, BlackList, System
from datetime import datetime
from django.db.models import Q
import datetime
from .local_date import local_date


class SystemSerializer(serializers.ModelSerializer):

    class Meta:
        model = System
        fields = [
            "service",
            "disabled"
        ]


class UserVariabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserVariability
        fields = [
            "variable",
            "value",
        ]


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "email"
        ]

    def validate_email(self, value):
        return value.lower()


class BlackListSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlackList
        fields = [
            "email"
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
            "statusDescription",
            "version",
        ]


class ReservationGETSerializer(serializers.ModelSerializer):
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
            "gear",
            "version",
            "payment"
        ]


class ReservationPOSTSerializer(serializers.ModelSerializer):

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
            "version",
        ]

    def validate(self, data):
        DAYSINADVANCETOMAKERESV = "maxFuture"  # how far in advance a resv can be made
        MAXRESVDAYS = "maxLength"  # Max days a resv can be
        MAXRENTALS = "maxReservations"  # Max reservations allowed at one time
        MAXGEARPERRENTAL = "maxGearPerReservation"  # Max gear allowed in reservation

        try:
            username = self.context['request']
        except ValueError:
            raise serializers.ValidationError("Original request data must be set in context")

        if username == "executive":
            userType = "executive"
        elif username == "admin":
            userType = "admin"
        else:
            userType = "member"

        if "email" not in data:
            raise serializers.ValidationError("Requests must have an email")
        try:
            Member.objects.get(email=data["email"])
        except Member.DoesNotExist:
            raise serializers.ValidationError("Email for this request not in database!")

        try:    # Check if blacklisted email
            blackListed = BlackList.objects.get(email=data["email"])
            if blackListed:
                raise serializers.ValidationError("You are not allowed to rent gear at this time. If you wish to know why, contact the outdoors club.")
                
        except BlackList.DoesNotExist:
            pass

        today = local_date()
        if data['startDate'] < today:
            raise serializers.ValidationError("Start date must be in the future.")

        if data['startDate'] > data['endDate']:
            raise serializers.ValidationError("Start date must be before the end date")

        if userType != "admin":
            maxTimeInAdvance = UserVariability.objects.get(pk=userType+DAYSINADVANCETOMAKERESV).value
            if (data['startDate'] - today).days > maxTimeInAdvance:
                raise serializers.ValidationError("Start date cannot be more than " + str(maxTimeInAdvance) + " days in advance")

            maxResvTime = UserVariability.objects.get(pk=userType+MAXRESVDAYS).value
            if (data['endDate'] - data['startDate']).days > maxResvTime:
                raise serializers.ValidationError("Length of reservation must be less than " + str(maxResvTime) + " days")

        ID = None
        if 'id' in self.initial_data:
            ID = self.initial_data['id']

        userReservations = Reservation.objects.filter(email=data["email"]).exclude(status="RETURNED").exclude(status="CANCELLED")
        if ID:
            userReservations = userReservations.exclude(id=ID)

        if userType != "admin":

            maxResvs = UserVariability.objects.get(pk=userType+MAXRENTALS).value
            if len(userReservations) >= maxResvs:
                raise serializers.ValidationError("You cannot have more than " + str(maxResvs) + " reservations")

            maxGear = UserVariability.objects.get(pk=userType+MAXGEARPERRENTAL).value
            if len(data['gear']) > maxGear:
                raise serializers.ValidationError("You cannot have more than " + str(maxGear) + " gear in your reservation")

        dateFilter = Q(startDate__range=[data['startDate'], data['endDate']]) | \
                     Q(endDate__range=[data['startDate'], data['endDate']]) | \
                     Q(startDate__lte=data['startDate'], endDate__gte=data['endDate'])

        overlappingRes = Reservation.objects.filter(dateFilter).exclude(status="CANCELLED").exclude(status="RETURNED")
        
        if overlappingRes.exists():

            # Remove the self reservation from overlappingRes. Used for patches
            if ID:
                overlappingRes = overlappingRes.exclude(pk=ID)

            denied = []
            for gear in data['gear']:
                if overlappingRes.filter(gear=gear).exists():
                    denied.append(gear.code)

                if len(denied) != 0:
                    message = ""
                    for item in denied:
                        message += str(item)
                        message += ", "
                    raise serializers.ValidationError("These items are unavailable: " + message[:-2])

        if "version" in data:
            data["version"] += 1
        return data
