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
            urgency VARCHAR(2000),
            date DATETIME,
            location VARCHAR(2000),
            type VARCHAR(2000),
            is_anonymous BOOLEAN,
            follow_up BOOLEAN,
            reporer_name VARCHAR(2000),
            reporter_dorm VARCHAR(2000),
            reporter_phone VARCHAR(2000),
            reporter_id_num VARCHAR(2000),
            PRIMARY KEY (id))
            ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"""
        )
        r.get_registry()['MY_SQL'].query(query)

    @staticmethod
    def record_report(created, urgency, date, location, ttype, is_anonymous, follow_up):
        query = """INSERT INTO report(
            created,
            urgency,
            date,
            location,
            type,
            is_anonymous,
            follow_up
        ) VALUES (
            %(created)s,
            %(urgency)s,
            %(date)s,
            %(location)s,
            %(type)s,
            %(is_anonymous)s,
            %(follow_up)s
        );"""
        data = {
            'created': created,
            'urgency': urgency,
            'date': date,
            'location': location,
            'type': ttype,
            'is_anonymous': is_anonymous,
            'follow_up': follow_up
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
            'verif_code': verif_code,
            'id': r_id
        }
        r.get_registry()['MY_SQL'].insert(query, data)


    @staticmethod
    def get_all_reports():
        query = """SELECT * FROM report ORDER BY created DESC;"""
        return r.get_registry()['MY_SQL'].get_all(query)
