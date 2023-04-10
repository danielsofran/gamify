import datetime
import pytz
from gamifyAPI import settings


def add_time_zone(datetime: datetime.datetime) -> datetime.datetime:
    settings_time_zone = pytz.timezone(settings.TIME_ZONE)
    datetime = datetime.astimezone(settings_time_zone)
    return datetime


def get_current_time():
    now = add_time_zone(datetime.datetime.now())
    date = now.date()
    time0 = datetime.time(0, 0, 0)
    time1 = datetime.time(23, 59, 59)
    time = now.time()
    return datetime.datetime.combine(date, time)