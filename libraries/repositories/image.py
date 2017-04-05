# -*- coding: utf-8; -*-

import registry as r


class Image(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and "
                "table_name='image';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS image(
            id INT AUTO_INCREMENT,
            report_id VARCHAR(2000),
            content TEXT,
            key_s3 VARCHAR(2000),
            iv VARCHAR(2000),
            aes_key VARCHAR(2000),
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT
            CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_image(
        report_id,
        content,
        iv,
        aes_key
    ):

        query = """INSERT INTO image(
            report_id,
            content,
            iv,
            aes_key
        ) VALUES (
            %(report_id)s,
            %(content)s,
            %(iv)s,
            %(aes_key)s
        );"""
        data = {
            'report_id': report_id,
            'content': content,
            'iv': iv,
            'aes_key': aes_key
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def get_images(report_id):
        query = """SELECT * FROM image where
            report_id = %(report_id)s"""
        data = {
            'report_id': report_id
        }
        return r.get_registry()['MY_SQL'].get_all(query, data)

    @staticmethod
    def update_key_s3(i_id, key_s3):
        query = """UPDATE image SET
            key_s3 = %(key_s3)s
            where id = %(id)s;"""

        data = {
            'key_s3': key_s3,
            'id': i_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)
