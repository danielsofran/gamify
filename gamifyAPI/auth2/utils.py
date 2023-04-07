import datetime
import pytz
from gamifyAPI import settings


def get_current_time():
    now = datetime.datetime.now()
    settings_time_zone = pytz.timezone(settings.TIME_ZONE)
    now = now.astimezone(settings_time_zone)
    date = now.date()
    time0 = datetime.time(0, 0, 0)
    time1 = datetime.time(23, 59, 59)
    time = now.time()
    return datetime.datetime.combine(date, time)