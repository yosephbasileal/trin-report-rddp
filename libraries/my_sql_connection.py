# -*- coding: utf-8; -*-

import MySQLdb
from constants import settings


# Methods for creating db connection and querying
class MySQLConnection(object):

    # Initializes a database connection
    def __init__(
            self, host=settings.mysql_host,
            port=settings.mysql_port,
            user=settings.mysql_user,
            passwd=settings.mysql_password,
            database=settings.mysql_database):
        self.db = MySQLdb.connect(host=host, port=port, user=user,
                                  passwd=passwd, db=database)
        self.db.ping(True)
        self.db.set_character_set('utf8')

    # Gets a db crusor
    def get_cursor(self):
        cursor = self.db.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SET NAMES utf8;')
        cursor.execute('SET CHARACTER SET utf8;')
        cursor.execute('SET character_set_connection=utf8;')
        return cursor

    # SELECT query, fetches one result
    def get(self, query, args=None):
        cursor = self.get_cursor()
        cursor.execute(query, args)
        row = cursor.fetchone()
        return row

    # SELECT query, fetches multiple rows
    def get_all(self, query, args=None):
        cursor = self.get_cursor()
        cursor.execute(query, args)
        return cursor.fetchall()

    # INSERT query
    def insert(self, query, args):
        cursor = self.get_cursor()
        cursor.execute(query, args)
        self.db.commit()
        return cursor.lastrowid

    # UPDATE and other queries
    def query(self, query, args=None):
        args = args or {}
        cursor = self.get_cursor()
        return cursor.execute(query, args)

    # Closes db connection
    def close(self):
        self.db.close()
