# -*- coding: utf-8; -*-

import registry as r
from libraries.utilities.my_sql_wrapper import MySqlWrapper as MySql


# Db class for app users info
# Used for authentication in case of emergency request
class User(object):

    # Creates table
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
            public_key_pem VARCHAR(450), PRIMARY KEY (user_id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    # Creates a new user
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
        return MySql.get_db_conn().insert(query, data)

    # Gets a user using their authentication token
    @staticmethod
    def get_user(auth_token):
        query = """SELECT * FROM user where auth_token = %(auth_token)s"""
        data = {
            'auth_token': auth_token
        }
        return MySql.get_db_conn().get(query, data)

    # Save the public key of a user, key is pem formatted string
    @staticmethod
    def publish_public_key(auth_token, public_key_pem):
        query = """UPDATE user SET
            public_key_pem = %(public_key_pem)s
            where auth_token = %(auth_token)s;"""

        data = {
            'public_key_pem': public_key_pem,
            'auth_token': auth_token
        }
        MySql.get_db_conn().insert(query, data)

    # Get the publick key of a user, key is pem formatted string
    @staticmethod
    def get_public_key(u_id):
        query = """SELECT public_key_pem FROM user where id = %(id)s"""
        data = {
            'id': u_id
        }
        return MySql.get_db_conn().get(query, data)
