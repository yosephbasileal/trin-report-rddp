# -*- coding: utf-8; -*-

import registry as r


class User(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and table_name='users';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS users(
            user_id VARCHAR(200),
            auth_token VARCHAR(500),
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def register_user(user_id, auth_token):
        query = """INSERT INTO users(
            user_id,
            auth_token
        ) VALUES (
            %(u_id)s,
            %(auth_token)s
        );"""
        data = {
            'user_id': user_id,
            'auth_token': auth_token
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

