# -*- coding: utf-8; -*-

import registry as r
from libraries.utilities.my_sql_wrapper import MySqlWrapper as MySql

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
            name VARCHAR(350),
            phone VARCHAR(350),
            id_num VARCHAR(350),
            email VARCHAR(350),
            dorm VARCHAR(350),
            longitude VARCHAR(350),
            latitude VARCHAR(350),
            location_last_updated DATETIME,
            handled_status BOOLEAN,
            handled_time DATETIME,
            explanation VARCHAR(350),
            callme BOOLEAN,
            done BOOLEAN,
            archived BOOLEAN,
            archived_time DATETIME,
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_emergency(
        created,
        name,
        phone,
        id_num,
        email,
        dorm,
        latitude,
        longitude,
        handled_status,
        explanation,
        archived,
        done
    ):
        query = """INSERT INTO emergency(
            created,
            name,
            phone,
            id_num,
            email,
            dorm,
            longitude,
            latitude,
            location_last_updated,
            handled_status,
            explanation,
            archived,
            done
        ) VALUES (
            %(created)s,
            %(name)s,
            %(phone)s,
            %(id_num)s,
            %(email)s,
            %(dorm)s,
            %(longitude)s,
            %(latitude)s,
            %(location_last_updated)s,
            %(handled_status)s,
            %(explanation)s,
            %(archived)s,
            %(done)s
        );"""
        data = {
            'created': created,
            'name': name,
            'phone': phone,
            'id_num': id_num,
            'email': email,
            'dorm': dorm,
            'longitude': longitude,
            'latitude': latitude,
            'location_last_updated': created,
            'handled_status': handled_status,
            'explanation': explanation,
            'archived': archived,
            'done': done
        }
        return MySql.get_db_conn().insert(query, data)

    @staticmethod
    def get_all_records():
        query = """SELECT * FROM emergency ORDER BY created DESC;"""
        return MySql.get_db_conn().get_all(query)

    @staticmethod
    def get_non_archived_records():
        query1 =  "SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;"
        MySql.get_db_conn().query(query1);
        query = """SELECT * FROM emergency where archived = %(archived)s
            ORDER BY created DESC;"""
        data = {
            'archived': False
        }
        records =  MySql.get_db_conn().get_all(query, data)
        query2 =  "SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ ;"
        MySql.get_db_conn().query(query2);
        return records

    @staticmethod
    def get_emergency(e_id):
        query = """SELECT * FROM emergency where id = %(id)s"""
        data = {
            'id': e_id
        }
        return MySql.get_db_conn().get(query, data)

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
        MySql.get_db_conn().insert(query, data)

    @staticmethod
    def archive_report(e_id, archived, archived_time):
        query = """UPDATE emergency SET
            archived = %(archived)s,
            archived_time = %(archived_time)s
            where id = %(id)s;"""

        data = {
            'archived': archived,
            'archived_time': archived_time,
            'id': e_id
        }
        MySql.get_db_conn().insert(query, data)

    @staticmethod
    def mark_as_done(e_id, done):
        query = """UPDATE emergency SET
            done = %(done)s
            where id = %(id)s;"""

        data = {
            'done': done,
            'id': e_id
        }
        MySql.get_db_conn().insert(query, data)

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
        MySql.get_db_conn().insert(query, data)

    @staticmethod
    def update_explanation(e_id, explanation):
        query = """UPDATE emergency SET
            explanation = %(explanation)s
            where id = %(id)s;"""

        data = {
            'explanation': explanation,
            'id': e_id
        }
        MySql.get_db_conn().insert(query, data)

    @staticmethod
    def update_callme(e_id, callme):
        query = """UPDATE emergency SET
            callme = %(callme)s
            where id = %(id)s;"""

        data = {
            'callme': callme,
            'id': e_id
        }
        MySql.get_db_conn().insert(query, data)

    @staticmethod
    def get_status(e_id):
        query = """SELECT handled_status, handled_time FROM emergency where id = %(id)s"""
        data = {
            'id': e_id
        }
        return MySql.get_db_conn().get(query, data)
