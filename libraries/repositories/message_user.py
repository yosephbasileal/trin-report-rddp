# -*- coding: utf-8; -*-

import registry as r
from libraries.utilities.my_sql_wrapper import MySqlWrapper as MySql

class MessageUser(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and "
                "table_name='message_user';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS message_user(
            id INT AUTO_INCREMENT,
            report_id VARCHAR(450),
            content VARCHAR(350),
            from_admin BOOLEAN,
            timestamp DATETIME,
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT
            CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_message(
        report_id,
        content,
        from_admin,
        timestamp
    ):

        query = """INSERT INTO message_user(
            report_id,
            content,
            from_admin,
            timestamp
        ) VALUES (
            %(report_id)s,
            %(content)s,
            %(from_admin)s,
            %(timestamp)s
        );"""
        data = {
            'report_id': report_id,
            'content': content,
            'from_admin': from_admin,
            'timestamp': timestamp
        }
        return MySql.get_db_conn().insert(query, data)

    @staticmethod
    def get_messages(report_id):
        query = """SELECT * FROM message_user where
            report_id = %(report_id)s
            ORDER BY timestamp ASC;"""
        data = {
            'report_id': report_id
        }
        return MySql.get_db_conn().get_all(query, data)
