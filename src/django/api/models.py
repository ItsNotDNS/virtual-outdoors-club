from django.db import models
from django.contrib.postgres.fields import JSONField
from django.core.validators import MinValueValidator


# system that enables particular parts of the system to be rendered available or disabled
class System(models.Model):
    service = models.CharField(max_length = 100)
    enabled = models.BooleanField(default = True)


# set a standard value for specific parameters in the system for members
class UserVariability(models.Model):
    variable = models.CharField(max_length = 100)
    value = models.IntegerField()


# storage for all of the current members in the club. Set to reset weekly-monthly
# there should not be any emails in the list that are duplicates
class Member(models.Model):
    email = models.EmailField(unique = True)


# storage for all of the blacklisted members in the club.
class BlackList(models.Model):
    email = models.EmailField()


# set a collection of available gear categories that are in the system
class GearCategory(models.Model):
    name = models.CharField(max_length=100)


# gearID is unique for every gear. Deletion will reset all conditions in the table.
# conditionHistory should be removed and history should be kept on a seperate table, referencing the gearID as the key
# description set to optional
class Gear(models.Model):

    CONDITION_CHOICE = (
        ("RENTABLE", "Rentable"),
        ("FLAGGED", "Flagged"),
        ("NEEDS_REPAIR", "Needs Repair"),
        ("DELETED", "Deleted"),
    )

    id = models.AutoField(primary_key = True)
    code = models.CharField(unique = True, max_length = 6)
    category = models.ForeignKey(GearCategory, on_delete = models.PROTECT)
    depositFee = models.DecimalField(max_digits = 10, decimal_places = 2, validators=[MinValueValidator(0)])
    description = models.CharField(max_length = 255, blank = True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICE, blank = True, default="RENTABLE")
    version = models.IntegerField(default=1)


# holds the details of a certain reservation from a member and who approves it
# upon return of the reservation, the status is then set to be returned
# if members are removed with reservations - set member to be removed (handle elsewhere)
# paid when pick up / day before
class Reservation(models.Model):

    # these statuses happen in sequence
    STATUS_CHOICE = (
        ("REQUESTED", "Requested"), # user has requested, unapproved by executives
        ("APPROVED", "Approved"),   # user has been approved by executive, but not paid
        ("PAID", "Paid"),           # user has been approved and paid for their reservation
        ("TAKEN", "Taken"),         # user has checked out their reservation
        ("RETURNED", "Returned"),   # user has returned their reservation
        ("CANCELLED", "Cancelled"), # the reservation has been cancelled (either by exec or user)
    )

    id = models.AutoField(primary_key = True)
    email = models.CharField(max_length = 50)
    licenseName = models.CharField(max_length = 100)
    licenseAddress = models.CharField(max_length = 200)
    approvedBy = models.CharField(max_length = 50)
    startDate = models.DateField()
    endDate = models.DateField()
    payment = JSONField(default = dict)
    gear = models.ManyToManyField(Gear)
    status = models.CharField(max_length = 20, choices = STATUS_CHOICE, default = "REQUESTED")
    version = models.IntegerField(default = 1)


# contains the permissions available that the Admin can delegate towards the executive accounts
# each permission should be able to explain itself what the user will be able to do
# permissions are set prior and are not manipulative
class Permission(models.Model):
    EDIT_BLACKLIST = "EDIT_BLACKLIST"
    EDIT_GEAR = "EDIT_GEAR"
    EDIT_RESERVATION = "EDIT_RESERVATION"
    CANCEL_RESERVATION = "CANCELLED"
    APPROVE_RESERVATION = "APPROVED"
    RENT_GEAR = "RENTED"

    PERMISSION_CHOICE = (
        (EDIT_BLACKLIST, "Edit Blacklist"),
        (EDIT_GEAR, "Edit Gear"),
        (EDIT_RESERVATION, "Edit Reservation"),
        (CANCEL_RESERVATION, "Cancelled"),
        (RENT_GEAR, "Rented"),
    )

    permissionID = models.AutoField(primary_key = True)
    permissionType = models.CharField(max_length = 30, choices = PERMISSION_CHOICE, default = None)


# retain history of payment methods with each reservation
class PaymentHistory(models.Model):
    CASH = "CASH"
    PAYPAL = "PAYPAL"
    UNDECIDED = "UNDECIDED"
    PAYMENT_CHOICE = (
        (CASH, "Cash"),
        (PAYPAL, "Paypal"),
        (UNDECIDED, "Undecided"),
    )

    reservationID = models.ForeignKey(Reservation, on_delete = models.PROTECT, default = None)
    paymentType = models.CharField(max_length = 20, choices = PAYMENT_CHOICE, default = None)
