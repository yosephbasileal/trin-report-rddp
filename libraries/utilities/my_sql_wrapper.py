# -*- coding: utf-8 -*-

from flask import g  # g is not shared across requests or application contexts
from libraries.my_sql_connection import MySQLConnection


# Wrapper class for creating new db connection for each flask context
class MySqlWrapper(object):

    # get db connection, create one if not created in current context
    @staticmethod
    def get_db_conn():
        conn = getattr(g, '_db_conn', None)
        if conn is None:
            conn = g._db_conn = MySQLConnection()
        return conn

    # close db connection of current context, if any
    @staticmethod
    def close_db_conn():
        conn = getattr(g, '_db_conn', None)
        if conn is not None:
            conn.close()
            


