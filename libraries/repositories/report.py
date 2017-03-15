# -*- coding: utf-8; -*-

import registry as r


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
            id INT AUTO_INCREMENT,
            created DATETIME,
            type VARCHAR(2000),
            urgency VARCHAR(2000),
            date DATETIME,
            location VARCHAR(2000),
            description VARCHAR(2000),
            is_anonymous BOOLEAN,
            is_res_emp BOOLEAN,
            follow_up BOOLEAN,
            reporer_name VARCHAR(2000),
            reporter_dorm VARCHAR(2000),
            reporter_email VARCHAR(2000),
            reporter_phone VARCHAR(2000),
            reporter_id_num VARCHAR(2000),
            followup_initiated BOOLEAN,
            archived BOOLEAN,
            archived_time DATETIME,
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_report(
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
        followup_initiated
    ):
        query = """INSERT INTO report(
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
            followup_initiated
        ) VALUES (
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
            %(followup_initiated)s
        );"""
        data = {
            'type': rtype,
            'created': created,
            'urgency': urgency,
            'date': date,
            'location': location,
            'type': ttype,
            'is_anonymous': is_anonymous,
            'is_res_emp': is_res_emp,
            'follow_up': follow_up,
            'archived': archived,
            'followup_initiated': followup_initiated
        }
        return r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def add_reporter(r_id, name, dorm, email, phone, id_num):
        query = """UPDATE report SET
            reporer_name = %(reporer_name)s,
            reporter_dorm = %(reporter_dorm)s,
            reporter_email = %(reporter_email)s,
            reporter_phone = %(reporter_phone)s,
            reporter_id_num = %(reporter_id_num)s,
            where id = %(id)s;"""

        data = {
            'reporer_name': name,
            'reporter_dorm': dorm,
            'reporter_email': email,
            'reporter_phone': phone,
            'reporter_id_num': id_num,
            'id': r_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)


    @staticmethod
    def get_all_reports():
        query = """SELECT * FROM report ORDER BY created DESC;"""
        return r.get_registry()['MY_SQL'].get_all(query)

    @staticmethod
    def get_non_archived_reports():
        query = """SELECT * FROM report where archived = %(archived)s
            ORDER BY created DESC;"""
        data = {
            'archived': False
        }
        return r.get_registry()['MY_SQL'].get_all(query, data)
        return records

    @staticmethod
    def get_report(r_id):
        query = """SELECT * FROM report where id = %(id)s"""
        data = {
            'id': r_id
        }
        return r.get_registry()['MY_SQL'].get(query, data)

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
        r.get_registry()['MY_SQL'].insert(query, data)

    @staticmethod
    def initiate_followup(r_id, followup_initiated):
        query = """UPDATE report SET
            followup_initiated = %(followup_initiated)s
            where id = %(id)s;"""

        data = {
            'followup_initiated': followup_initiated,
            'id': r_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)
