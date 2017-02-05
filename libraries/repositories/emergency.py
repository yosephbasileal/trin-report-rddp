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
            name VARCHAR(200),
            dorm VARCHAR(200),
            phone VARCHAR(200),
            email VARCHAR(200),
            id_num VARCHAR(200),
            longitude DOUBLE,
            latitude DOUBLE,
            location_last_updated DATETIME,
            handled_status BOOLEAN,
            handled_time DATETIME,
            explanation VARCHAR(500),
            callme BOOLEAN,
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_emergency(
        created,
        name,
        dorm,
        phone,
        email,
        id_num,
        latitude,
        longitude,
        handled_status
    ):
        query = """INSERT INTO emergency(
            created,
            name,
            dorm,
            phone,
            email,
            id_num,
            longitude,
            latitude,
            location_last_updated,
            handled_status
        ) VALUES (
            %(created)s,
            %(name)s,
            %(dorm)s,
            %(phone)s,
            %(email)s,
            %(id_num)s,
            %(longitude)s,
            %(latitude)s,
            %(location_last_updated)s,
            %(handled_status)s
        );"""
        data = {
            'created': created,
            'name': name,
            'dorm': dorm,
            'phone': phone,
            'email': email,
            'id_num': id_num,
            'longitude': longitude,
            'latitude': latitude,
            'location_last_updated': created,
            'handled_status': handled_status
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_all_records():
        query = """SELECT * FROM emergency ORDER BY created DESC;"""
        return r.get_registry()['MY_SQL'].get_all(query)

    @staticmethod
    def get_emergency(e_id):
        query = """SELECT * FROM emergency where id = %(id)s"""
        data = {
            'id': e_id
        }
        return r.get_registry()['MY_SQL'].get(query, data)

    @staticmethod
    def update_status(e_id, handled_status, timestamp):
        query = """UPDATE emergency SET
            handled_status = %(handled_status)s,
            handled_time = %(handled_time)s
            where id = %(id)s;"""

        data = {
            'handled_status': handled_status,
            'handled_time': timestamp,
            'id': e_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def update_location(e_id, longitude, latitude, timestamp):
        query = """UPDATE emergency SET
            longitude = %(longitude)s,
            latitude = %(latitude)s,
            location_last_updated = %(location_last_updated)s
            where id = %(id)s;"""

        data = {
            'longitude': longitude,
            'latitude': latitude,
            'location_last_updated': timestamp,
            'id': e_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def update_explanation(e_id, explanation):
        query = """UPDATE emergency SET
            explanation = %(explanation)s
            where id = %(id)s;"""

        data = {
            'explanation': explanation,
            'id': e_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def update_callme(e_id, callme):
        query = """UPDATE emergency SET
            callme = %(callme)s
            where id = %(id)s;"""

        data = {
            'callme': callme,
            'id': e_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_status(e_id):
        query = """SELECT handled_status, handled_time FROM emergency where id = %(id)s"""
        data = {
            'id': e_id
        }
        return r.get_registry()['MY_SQL'].get(query, data)
