from datetime import datetime
import pytz


def local_date():
    today = datetime.today().replace(tzinfo=pytz.utc)
    today = today.astimezone(pytz.timezone("America/Edmonton")).date()

    return today
