# -*- coding: utf-8; -*-

import registry as r
from libraries.utilities.my_sql_wrapper import MySqlWrapper as MySql

class Thread(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and "
                "table_name='thread';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS thread(
            id_dummy INT AUTO_INCREMENT,
            user_pub_key VARCHAR(4096),
            title VARCHAR(500),
            report_id VARCHAR(2000),
            last_updated DATETIME,
            last_message TEXT,
            PRIMARY KEY(id_dummy))
            ENGINE=InnoDB DEFAULT
            CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_thread(
        title,
        user_pub_key,
        report_id,
        last_updated
    ):
        query = """INSERT INTO thread(
            title,
            user_pub_key,
            report_id,
            last_updated
        ) VALUES (
            %(title)s,
            %(user_pub_key)s,
            %(report_id)s,
            %(last_updated)s
        );"""
        data = {
            'title': title,
            'user_pub_key': user_pub_key,
            'report_id': report_id,
            'last_updated': last_updated
        }
        return MySql.get_db_conn().insert(query, data)

    @staticmethod
    def update_last_message(message, time, t_id):
        query = """UPDATE thread SET
            last_updated = %(last_updated)s,
            last_message = %(last_message)s
            where report_id = %(report_id)s;"""
        data = {
            'last_updated': time,
            'last_message': message,
            'report_id': t_id
        }
        return MySql.get_db_conn().insert(query, data)

    @staticmethod
    def get_thread(thread_id):
        query = """SELECT * FROM thread where
            report_id = %(report_id)s"""
        data = {
            'report_id': thread_id
        }
        return MySql.get_db_conn().get_all(query, data)

    @staticmethod
    def get_thread_by_report_id(report_id):
        query = """SELECT * FROM thread
            where report_id = %(report_id)s;"""
        data = {
            'report_id': report_id
        }
        return MySql.get_db_conn().get(query, data)