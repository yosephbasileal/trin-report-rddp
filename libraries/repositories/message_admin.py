# -*- coding: utf-8; -*-

import registry as r


class MessageAdmin(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and "
                "table_name='message_admin';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS message_admin(
            id INT AUTO_INCREMENT,
            report_id VARCHAR(2000),
            content TEXT,
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

        query = """INSERT INTO message_admin(
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
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_messages(report_id):
        query = """SELECT * FROM message_admin where
            report_id = %(report_id)s
            ORDER BY timestamp ASC;"""
        data = {
            'report_id': report_id
        }
        return r.get_registry()['MY_SQL'].get_all(query, data)
