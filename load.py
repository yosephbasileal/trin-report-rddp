# -*- coding: utf-8 -*-
from initialize_registry import load_registry
import registry as r
import MySQLdb
from constants import settings


def run():
    # get database connection
    db = MySQLdb.connect(
        host=settings.mysql_host,
        port=settings.mysql_port,
        user=settings.mysql_user,
        passwd=settings.mysql_password)

    # create database
    db.query('CREATE DATABASE IF NOT EXISTS trin_report;')
    load_registry()

    # set character set of database
    r.get_registry()['MY_SQL'].query(
        'ALTER DATABASE trin_report CHARACTER SET '
        'utf8 COLLATE utf8_general_ci;'
    )

    # create all database tables
    r.get_registry()['USER'].create_table()
    r.get_registry()['EMERGENCY'].create_table()
    r.get_registry()['ADMIN'].create_table()
    r.get_registry()['REPORT'].create_table()
    r.get_registry()['MESSAGE_ADMIN'].create_table()
    r.get_registry()['MESSAGE_USER'].create_table()
    r.get_registry()['IMAGE'].create_table()


if __name__ == "__main__":
    run()
