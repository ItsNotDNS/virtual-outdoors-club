from django.db import models
from django.core.validators import MinValueValidator
from simple_history.models import HistoricalRecords


# system that enables particular parts of the system to be rendered available or disabled
class System(models.Model):
    service = models.CharField(max_length = 100, primary_key=True)
    disabled = models.BooleanField(default = False)


# set a standard value for specific parameters in the system for members
class UserVariability(models.Model):
    variable = models.CharField(max_length = 100, primary_key=True)
    value = models.IntegerField()


# storage for all of the current members in the club. Set to reset weekly-monthly
# there should not be any emails in the list that are duplicates
class Member(models.Model):
    email = models.EmailField(primary_key=True)


# storage for all of the blacklisted members in the club.
class BlackList(models.Model):
    email = models.EmailField(primary_key=True)


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
    category = models.ForeignKey(GearCategory, on_delete = models.PROTECT, null = True)
    depositFee = models.DecimalField(max_digits = 5, decimal_places = 2, validators=[MinValueValidator(0)])
    description = models.CharField(max_length = 255, blank = True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICE, blank = True, default="RENTABLE")
    statusDescription = models.CharField(max_length = 100, blank = True)
    version = models.IntegerField(default=1)
    history = HistoricalRecords()


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
    payment = models.CharField(max_length = 28, blank = True)
    gear = models.ManyToManyField(Gear)
    status = models.CharField(max_length = 20, choices = STATUS_CHOICE, default = "REQUESTED")
    version = models.IntegerField(default = 1)
    history = HistoricalRecords()


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


class GearStat(models.Model):
    counter = models.PositiveSmallIntegerField(default=0)
    gearID = models.ForeignKey(Gear, on_delete = models.CASCADE)
    usage = models.DecimalField(max_digits=4, decimal_places=2)

