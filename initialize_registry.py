# -*- coding: utf-8; -*-

import redis
import registry
from constants import settings
from libraries.my_sql_connection import MySQLConnection
from raven import Client
from libraries.repositories.user import User


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
