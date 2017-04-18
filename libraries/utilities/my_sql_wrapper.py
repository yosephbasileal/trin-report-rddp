# -*- coding: utf-8 -*-

from flask import g
from libraries.my_sql_connection import MySQLConnection

class MySqlWrapper(object):

    @staticmethod
    def get_db_conn():
        conn = getattr(g, '_db_conn', None)
        if conn is None:
            conn = g._db_conn = MySQLConnection()
        return conn

    @staticmethod
    def close_db_conn():
        conn = getattr(g, '_db_conn', None)
        if conn is not None:
            conn.close()
            


