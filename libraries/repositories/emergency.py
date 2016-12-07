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
        longitud
    ):
        query = """INSERT INTO emergency(
            created,
            name,
            dorm,
            phone,
            email,
            id_num
            longitude,
            latitude
        ) VALUES (
            %(created)s,
            %(name)s,
            %(dorm)s,
            %(phone)s,
            %(email)s,
            %(id_num)s,
            %(longitude)s,
            %(latitude)s
        );"""
        data = {
            'created': created,
            'name': name,
            'dorm': dorm,
            'phone': phone,
            'email': email,
            'id_num': id_num,
            'longitude': longitude,
            'latitude': latitude
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_all_records():
        query = """SELECT * FROM emergency ORDER BY created DESC;"""
        return r.get_registry()['MY_SQL'].get_all(query)
