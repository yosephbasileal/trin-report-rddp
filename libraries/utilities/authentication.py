# -*- coding: utf-8 -*-

import string
import random
import hashlib


class Authentication(object):

    # makes random salt of length five
    @staticmethod
    def make_salt():
        return ''.join(
            random.choice(string.letters) for x in xrange(5)
        )

    # hashes the password and combines it with salt
    @staticmethod
    def make_pw_hash(name, pw, salt=None):
        if not salt:  # create a new salt if a new user registers
            salt = Authentication.make_salt()
        h = hashlib.sha256(name + pw + salt).hexdigest()
        return "%s,%s" % (h, salt)  # combine hashed password and salt

    # validate passoword by comparing to the hash already stored
    @staticmethod
    def valid_pw(name, pw, h):
        salt = h.split(',')[1]
        return h == Authentication.make_pw_hash(name, pw, salt)

    # hashes email address for email address verification
    @staticmethod
    def make_email_hash(secret, email, h):
        h = hashlib.sha256(secret + email + h).hexdigest()
        return "%s" % (h)
