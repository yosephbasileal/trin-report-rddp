# -*- coding: utf-8 -*-
from initialize_registry import load_registry
import registry as r


def run():
    load_registry()
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE users;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE admin;'
    )
    r.get_registry()['MY_SQL'].query(
        'DROP TABLE emergency;'
    )

if __name__ == "__main__":
	run()
