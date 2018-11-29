from rest_framework.decorators import api_view
from ..models import GearStat
from .error import *
import datetime


@api_view(['GET'])
def statistics(request):
    start = request.query_params.get("from", None)
    end = request.query_params.get("to", None)
    today = datetime.datetime.today()

    # Error check the dates to be in YYYY-MM-DD and not in the future
    if start:
        try:
            start = datetime.datetime.strptime(start, '%Y-%m-%d')
        except ValueError:
            return RespError(400, "The start date is in an invalid format. Make sure it's in the YYYY-MM-DD format.")

        if start > today:
            return RespError(400, "The start date cannot be in the future.")

    if end:
        try:
            end = datetime.datetime.strptime(end, '%Y-%m-%d')
        except ValueError:
            return RespError(400, "The end date is in an invalid format. Make sure it's in the YYYY-MM-DD format.")

        if end > today:
            return RespError(400, "The end date cannot be in the future.")

    if not start and not end:
        end = today
        start = today - datetime.timedelta(days=4)
    elif start and not end:
        end = today
    elif not start and end:
        start = end - datetime.timedelta(days=4)

    if start and end and end < start:
            return RespError(400, "The end date cannot be before the start date.")

    gear_ids = GearStat.objects.values_list("gearID", flat=True).distinct()

    # Calculate the date range
    lowerbound = (today.date() - end.date()).days
    lowerbound = (lowerbound + 7 // 2) // 7

    upperbound = (end.date() - start.date()).days
    upperbound = (upperbound + 7 // 2) // 7 + lowerbound

    # Serialize the statistics between the date range
    gSerial = {}
    cSerial = {}
    catDiv = {}
    for gid in gear_ids:
        ub = upperbound

        gear_stats = GearStat.objects.filter(gearID=gid, counter=7).order_by('-id')
        size = gear_stats.count()
        if size < lowerbound:
            continue

        if size < upperbound:
            ub = size

        pos = 0

        for gs in gear_stats[lowerbound:ub]:
            if gs.gearID.code in gSerial:
                gSerial[gs.gearID.code]["usage"][pos] = gs.usage / 7
            else:
                gSerial[gs.gearID.code] = {"description": gs.gearID.description, "usage": [0] * (upperbound - lowerbound)}
                gSerial[gs.gearID.code]["usage"][0] = gs.usage / 7

            if gs.gearID.category.name in cSerial:
                cSerial[gs.gearID.category.name][pos] += gs.usage
                catDiv[gs.gearID.category.name][pos] += 1
            else:
                cSerial[gs.gearID.category.name] = [0]*(upperbound-lowerbound)
                cSerial[gs.gearID.category.name][0] = gs.usage
                catDiv[gs.gearID.category.name] = [1]*(upperbound-lowerbound)
            pos += 1

    for category in cSerial:
        for x in range(len(cSerial[category])):
            cSerial[category][x] = cSerial[category][x] / (7 * (catDiv[category][x]))

    return Response({"data": {"gear": gSerial, "category": cSerial}})
