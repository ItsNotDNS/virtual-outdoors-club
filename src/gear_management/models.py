from django.db import models

# gearID is unique for every gear. Deletion will reset all conditions in the table.
# conditionHistory should be removed and history should be kept on a seperate table, referencing the gearID as the key
# description set to optional
class Gear(models.Model):
	gearUUID = models.AutoField(primary_key = True)
	gearID = models.CharField(max_length = 6)
	gearType = models.CharField(max_length = 3)
	available = models.BooleanField(default = True)
	depositFee = models.DecimalField(max_digits = 10, decimal_places = 2)
	description = models.CharField(max_length = 255, blank = True)

class GearCategory(models.Model):
	categoryID = models.AutoField(primary_key = True)
	description = models.CharField(max_length = 100)
	symbol = models.CharField(max_length = 3)

class Condition(models.Model):
	conditionID = models.AutoField(primary_key = True)
	date = models.DateField(auto_now = True)

	EXCELLENT = "EXCELLENT"
	GOOD = "GOOD"
	ADEQUATE = "ADEQUATE"
	POOR = "POOR"
	DAMAGED = "DAMAGED"
	
	CONDITION_CHOICE = (
		(EXCELLENT, 'Excellent'),
		(GOOD, 'Good'),
		(ADEQUATE, 'Adequate'),
		(POOR, 'Poor'),
		(DAMAGED, 'Damaged'),
	)

	condition = models.CharField(max_length = 15, choices = CONDITION_CHOICE, default = EXCELLENT)
	gearID = models.ForeignKey(Gear, on_delete = models.PROTECT)
	
class Reservation(models.Model):
	reservationID = models.AutoField(primary_key = True)
	reservedBy = models.EmailField()
	approvedBy = models.CharField(max_length = 50)
	gearReserved = models.ForeignKey(Gear, on_delete = models.PROTECT)
	startDate = models.DateField()
	endDate = models.DateField()

	REQUESTED = 'REQUESTED'
	APPROVED = 'APPROVED'
	CANCELLED = 'CANCELLED'
	TAKEN = 'TAKEN'
	RETURNED = 'RETURNED'
	
	STATUS_CHOICE = (
		(REQUESTED, 'Requested'),
		(APPROVED, 'Approved'),
		(CANCELLED, 'Cancelled'),
		(TAKEN, 'Taken'),
		(RETURNED, 'Returned'),
	)

	status = models.CharField(max_length = 20, choices = STATUS_CHOICE, default = REQUESTED)

# TODO: use of primary key
class Permission(models.Model):
	EDIT_BLACKLIST = 'EDIT_BLACKLIST'
	EDIT_GEAR = 'EDIT_GEAR'
	EDIT_RESERVATION = 'EDIT_RESERVATION'
	CANCEL_RESERVATION = 'CANCELLED'
	APPROVE_RESERVATION = 'APPROVED'
	RENT_GEAR = 'RENTED'

	PERMISSION_CHOICE = (
		(EDIT_BLACKLIST, 'Edit Blacklist'),
		(EDIT_GEAR, 'Edit Gear'),
		(EDIT_RESERVATION, 'Edit Reservation'),
		(CANCEL_RESERVATION, 'Cancelled'),
		(RENT_GEAR, 'Rented'),
	)

	permissionID = models.AutoField(primary_key = True)
	permissionType = models.CharField(max_length = 30, choices = PERMISSION_CHOICE, default = None)
	# owner = models.ForeignKey(User, on_delete = models.PROTECT)
