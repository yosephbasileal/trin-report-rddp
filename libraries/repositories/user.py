# -*- coding: utf-8; -*-

import registry as r


class User(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and table_name='user';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS user(
            user_id VARCHAR(32),
            auth_token VARCHAR(64),
            public_key_jwk VARCHAR(450),
            PRIMARY KEY (user_id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def register_user(user_id, auth_token):
        query = """INSERT INTO user(
            user_id,
            auth_token
        ) VALUES (
            %(user_id)s,
            %(auth_token)s
        );"""
        data = {
            'user_id': user_id,
            'auth_token': auth_token
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_user(auth_token):
        query = """SELECT * FROM user where auth_token = %(auth_token)s"""
        data = {
            'auth_token': auth_token
        }
        return r.get_registry()['MY_SQL'].get(query, data)

    @staticmethod
    def publish_public_key(auth_token, public_key_jwk):
        query = """UPDATE user SET
            public_key_jwk = %(public_key_jwk)s
            where auth_token = %(auth_token)s;"""

        data = {
            'public_key_jwk': public_key_jwk,
            'auth_token': auth_token
        }
        r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_public_key(u_id):
        query = """SELECT public_key_jwk FROM user where id = %(id)s"""
        data = {
            'id': u_id
        }
        return r.get_registry()['MY_SQL'].get(query, data)

