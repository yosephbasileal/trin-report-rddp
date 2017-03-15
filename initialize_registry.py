# -*- coding: utf-8; -*-

import redis
import registry
from constants import settings
from libraries.my_sql_connection import MySQLConnection
from raven import Client
from libraries.repositories.user import User
from libraries.repositories.emergency import Emergency
from libraries.repositories.admin import Admin
from libraries.repositories.report import Report
from libraries.repositories.thread import Thread
from libraries.repositories.message import Message


def load_registry():
    """ Initialize and load the global registry
    """
    r = registry.get_registry()
    if r.is_locked():
        return
    init_mysql(r)
    init_redis(r)
    init_db_objects(r)
    r.lock()


def init_mysql(r):
    r['MY_SQL'] = MySQLConnection()


def init_redis(r):
    r['REDIS'] = redis.StrictRedis(
        host=settings.redis_host,
        port=settings.redis_port,
        db=settings.redis_db
    )


def init_db_objects(r):
    r['USER'] = User
    r['ADMIN'] = Admin
    r['EMERGENCY'] = Emergency
    r['REPORT'] = Report
    r['THREAD'] = Thread
    r['MESSAGE'] = Message
