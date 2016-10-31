# -*- coding: utf-8; -*-

import registry as r


class Emergency(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and table_name='emergency';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS emergency(
            id INT AUTO_INCREMENT,
            created DATETIME,
            longitude DOUBLE,
            latitude DOUBLE,
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_emergency(created, latitude, longitude):
        query = """INSERT INTO emergency(
            created,
            longitude,
            latitude
        ) VALUES (
            %(created)s,
            %(longitude)s,
            %(latitude)s
        );"""
        data = {
            'created': created,
            'longitude': longitude,
            'latitude': latitude
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_all_records():
        query = """SELECT * FROM emergency ORDER BY created DESC;"""
        return r.get_registry()['MY_SQL'].get_all(query)
