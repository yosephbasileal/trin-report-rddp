# -*- coding: utf-8; -*-

import registry as r


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
            id INT AUTO_INCREMENT,
            user_token VARCHAR(500),
            title VARCHAR(500),
            report_id INT,
            last_updated DATETIME,
            last_message TEXT,
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT
            CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_thread(
        title,
        user_token,
        report_id,
        last_updated
    ):
        query = """INSERT INTO thread(
            title,
            user_token,
            report_id,
            last_updated
        ) VALUES (
            %(title)s,
            %(user_token)s,
            %(report_id)s,
            %(last_updated)s
        );"""
        data = {
            'title': title,
            'user_token': user_token,
            'report_id': report_id,
            'last_updated': last_updated
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def update_last_message(message, time, t_id):
        query = """UPDATE thread SET
            last_updated = %(last_updated)s,
            last_message = %(last_message)s
            where id = %(id)s;"""
        data = {
            'last_updated': time,
            'last_message': message,
            'id': t_id
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_thread(thread_id):
        query = """SELECT * FROM thread where
            id = %(id)s"""
        data = {
            'id': thread_id
        }
        return r.get_registry()['MY_SQL'].get_all(query, data)

    @staticmethod
    def get_threads_of_user(user_token):
        query = """SELECT * FROM thread where user_token = %(user_token)s
            ORDER BY last_updated DESC;"""
        data = {
            'user_token': user_token
        }
        return r.get_registry()['MY_SQL'].get_all(query, data)

    @staticmethod
    def get_thread_by_report_id(report_id):
        query = """SELECT * FROM thread
            where report_id = %(report_id)s;"""
        data = {
            'report_id': report_id
        }
        return r.get_registry()['MY_SQL'].get(query, data)