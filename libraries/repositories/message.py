# -*- coding: utf-8; -*-

import registry as r


class Message(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and "
                "table_name='message';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS message(
            id INT AUTO_INCREMENT,
            thread_id INT,
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
        thread_id,
        content,
        from_admin,
        timestamp
    ):

        query = """INSERT INTO message(
            thread_id,
            content,
            from_admin,
            timestamp
        ) VALUES (
            %(thread_id)s,
            %(content)s,
            %(from_admin)s,
            %(timestamp)s
        );"""
        data = {
            'thread_id': thread_id,
            'content': content,
            'from_admin': from_admin,
            'timestamp': timestamp
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_messages_of_thread(t_id):
        query = """SELECT * FROM message where
            thread_id = %(thread_id)s
            ORDER BY timestamp ASC;"""
        data = {
            'thread_id': t_id
        }
        return r.get_registry()['MY_SQL'].get_all(query, data)
