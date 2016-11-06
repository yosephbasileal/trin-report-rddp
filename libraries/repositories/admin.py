# -*- coding: utf-8; -*-

import registry as r


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
            first_name VARCHAR(200),
            last_name VARCHAR(200),
            email VARCHAR(200),
            password VARCHAR(200),
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def create_test_admin(first_name,
        last_name,
        email,
        password
    ):
        query = """INSERT INTO admin(
            first_name,
            last_name,
            email,
            password
        ) VALUES (
            %(first_name)s,
            %(last_name)s,
            %(email)s,
            %(password)s
        );"""
        data = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_admin_by_email(email):
        query = """SELECT * FROM admin where email = %(email)s"""
        data = {
            'email': email
        }
        return r.get_registry()['MY_SQL'].get(query, data)

