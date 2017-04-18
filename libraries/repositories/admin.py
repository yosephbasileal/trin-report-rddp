# -*- coding: utf-8; -*-

import registry as r
from libraries.utilities.my_sql_wrapper import MySqlWrapper as MySql


class Admin(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and table_name='admin';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS admin(
            id INT AUTO_INCREMENT,
            email VARCHAR(200),
            password VARCHAR(200),
            public_key_pem VARCHAR(4096),
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        #MySql.get_db_conn().query(query)
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def create_admin(
        email,
        password,
        public_key_pem
    ):
        query = """INSERT INTO admin(
            email,
            password,
            public_key_pem
        ) VALUES (
            %(email)s,
            %(password)s,
            %(public_key_pem)s
        );"""
        data = {
            'email': email,
            'password': password,
            'public_key_pem': public_key_pem
        }
        return MySql.get_db_conn().insert(query, data)

    @staticmethod
    def get_admin_by_email(email):
        query = """SELECT * FROM admin where email = %(email)s"""
        data = {
            'email': email
        }
        return MySql.get_db_conn().get(query, data)

    @staticmethod
    def publish_public_key(a_id, public_key_pem):
        query = """UPDATE admin SET
            public_key_pem = %(public_key_pem)s
            where id = %(id)s;"""

        data = {
            'public_key_pem': public_key_pem,
            'id': a_id
        }
        MySql.get_db_conn().insert(query, data)

    @staticmethod
    def get_public_key(admin_email):
        query = """SELECT public_key_pem FROM admin where email = %(email)s"""
        data = {
            'email': admin_email
        }
        return MySql.get_db_conn().get(query, data)


