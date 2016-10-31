# -*- coding: utf-8 -*-
import registry as r
from initialize_registry import load_registry
from libraries.utilities.authentication import Authentication

# Test users
USERS = [
    {
        'first_name': 'Basileal',
        'last_name': 'Imana',
        'password': '123',
        'email': 'user@domain.com',
    }
]

def run():
    load_registry()

    for user in USERS:
        pw_hash = Authentication.make_pw_hash(
            user.get('email'),
            user.get('password')
        )

        r.get_registry()['ADMIN'].create_test_admin(
            user.get('first_name'),
            user.get('last_name'),
            user.get('email'),
            pw_hash
        )

if __name__ == "__main__":
    run()
