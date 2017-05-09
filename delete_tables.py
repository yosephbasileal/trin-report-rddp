# -*- coding: utf-8 -*-
from initialize_registry import load_registry
import registry as r

# Deletes all database tables
def run():
    load_registry()
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE user;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE admin;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE emergency;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE report;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE message_admin;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE message_user;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE image;'
    )

if __name__ == "__main__":
	run()
