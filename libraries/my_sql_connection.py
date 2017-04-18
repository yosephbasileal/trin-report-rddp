# -*- coding: utf-8; -*-

import MySQLdb
from constants import settings


class MySQLConnection(object):
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

    def get_cursor(self):
        cursor = self.db.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SET NAMES utf8;')
        cursor.execute('SET CHARACTER SET utf8;')
        cursor.execute('SET character_set_connection=utf8;')
        return cursor

    def get(self, query, args=None):
        cursor = self.get_cursor()
        cursor.execute(query, args)
        row = cursor.fetchone()
        return row

    def get_all(self, query, args=None):
        cursor = self.get_cursor()
        cursor.execute(query, args)
        return cursor.fetchall()

    def insert(self, query, args):
        cursor = self.get_cursor()
        cursor.execute(query, args)
        self.db.commit()
        return cursor.lastrowid

    def query(self, query, args=None):
        args = args or {}
        cursor = self.get_cursor()
        return cursor.execute(query, args)

    def close(self):
        self.db.close()
