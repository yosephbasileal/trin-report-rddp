# -*- coding: utf-8; -*-

import registry as r
from libraries.utilities.my_sql_wrapper import MySqlWrapper as MySql

class Report(object):
    @staticmethod
    def create_table():
        result = r.get_registry()['MY_SQL'].query(
            (
                "select * from information_schema.tables where "
                "TABLE_SCHEMA='trin_report' and table_name='report';"
            )
        )
        if result != 0:
            return
        query = (
            """CREATE TABLE IF NOT EXISTS report(
            id_dummy INT AUTO_INCREMENT,
            id VARCHAR(64),
            user_pub_key VARCHAR(450),
            created DATETIME,
            type VARCHAR(350),
            urgency VARCHAR(350),
            date DATETIME,
            location VARCHAR(350),
            description VARCHAR(350),
            is_anonymous BOOLEAN,
            is_res_emp BOOLEAN,
            follow_up BOOLEAN,
            reporer_name VARCHAR(350),
            reporter_dorm VARCHAR(350),
            reporter_email VARCHAR(350),
            reporter_phone VARCHAR(350),
            reporter_id_num VARCHAR(350),
            followup_initiated BOOLEAN,
            archived BOOLEAN,
            archived_time DATETIME,
            image_sym_key VARCHAR(50),
            PRIMARY KEY (id_dummy))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_report(
        report_id,
        user_pub_key,
        created,
        rtype,
        urgency,
        date,
        location,
        description,
        is_anonymous,
        is_res_emp,
        follow_up,
        archived,
        followup_initiated,
        image_sym_key
    ):
        query = """INSERT INTO report(
            id,
            user_pub_key,
            type,
            created,
            urgency,
            date,
            location,
            description,
            is_anonymous,
            is_res_emp,
            follow_up,
            archived,
            followup_initiated,
            image_sym_key
        ) VALUES (
            %(id)s,
            %(user_pub_key)s,
            %(type)s,
            %(created)s,
            %(urgency)s,
            %(date)s,
            %(location)s,
            %(description)s,
            %(is_anonymous)s,
            %(is_res_emp)s,
            %(follow_up)s,
            %(archived)s,
            %(followup_initiated)s,
            %(image_sym_key)s
        );"""
        data = {
            'id': report_id,
            'user_pub_key': user_pub_key,
            'type': rtype,
            'created': created,
            'urgency': urgency,
            'date': date,
            'location': location,
            'description': description,
            'is_anonymous': is_anonymous,
            'is_res_emp': is_res_emp,
            'follow_up': follow_up,
            'archived': archived,
            'followup_initiated': followup_initiated,
            'image_sym_key': image_sym_key
        }
        return MySql.get_db_conn().insert(query, data)

    @staticmethod
    def add_reporter(r_id, name, dorm, email, phone, id_num):
        query = """UPDATE report SET
            reporer_name = %(reporer_name)s,
            reporter_dorm = %(reporter_dorm)s,
            reporter_email = %(reporter_email)s,
            reporter_phone = %(reporter_phone)s,
            reporter_id_num = %(reporter_id_num)s
            where id_dummy = %(id_dummy)s;"""

        data = {
            'reporer_name': name,
            'reporter_dorm': dorm,
            'reporter_email': email,
            'reporter_phone': phone,
            'reporter_id_num': id_num,
            'id_dummy': r_id
        }
        MySql.get_db_conn().insert(query, data)


    @staticmethod
    def get_all_reports():
        query = """SELECT * FROM report ORDER BY created DESC;"""
        return MySql.get_db_conn().get_all(query)

    @staticmethod
    def get_non_archived_reports():
        query = """SELECT * FROM report where archived = %(archived)s
            ORDER BY created DESC;"""
        data = {
            'archived': False
        }
        return MySql.get_db_conn().get_all(query, data)

    @staticmethod
    def get_report(r_id):
        query = """SELECT * FROM report where id = %(id)s"""
        data = {
            'id': r_id
        }
        return MySql.get_db_conn().get(query, data)

    @staticmethod
    def archive_report(r_id, archived, archived_time):
        query = """UPDATE report SET
            archived = %(archived)s,
            archived_time = %(archived_time)s
            where id = %(id)s;"""

        data = {
            'archived': archived,
            'archived_time': archived_time,
            'id': r_id
        }
        MySql.get_db_conn().insert(query, data)

    @staticmethod
    def initiate_followup(r_id, followup_initiated):
        query = """UPDATE report SET
            followup_initiated = %(followup_initiated)s
            where id = %(id)s;"""

        data = {
            'followup_initiated': followup_initiated,
            'id': r_id
        }
        MySql.get_db_conn().insert(query, data)
