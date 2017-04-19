# -*- coding: utf-8 -*-

from flask import session
import registry as r
from libraries.utilities.authentication import Authentication


# Methods for signin validation, login, logout of admin user
class Signin(object):

    # validates sign in form input
    @staticmethod
    def validate_signin(email, passw):
        error = {}
        user = r.get_registry()['ADMIN'].get_admin_by_email(email)

        if not email:
            error['email_error'] = 'Please enter your email address'

        if not passw:
            error['password_error'] = 'Please enter a password'

        if email and passw:
            if not user:
                error['email_error'] = 'Incorrect email or password'
                error['password_error'] = 'Incorrect email or password'
            elif (not Authentication.valid_pw(
                    email,
                    passw,
                    user.get('password')
                )
            ):
                error['email_error'] = 'Incorrect email or password'
                error['password_error'] = 'Incorrect email or password'
        return error

    # log a admin in
    @staticmethod
    def login(email):
        session['email'] = email

    # log a admin out
    @staticmethod
    def logout():
        session.pop('email', None)

    # check if admin is loggedin
    @staticmethod
    def is_loggedin():
        return 'email' in session

    # get loggein in admin object from db
    @staticmethod
    def get_logged_in_user():
        email = session.get('email')
        user = r.get_registry()['ADMIN'].get_admin_by_email(email)
        return user
