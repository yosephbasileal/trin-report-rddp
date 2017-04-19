# -*- coding: utf-8 -*-

from flask import (
    Blueprint, url_for, request, redirect, jsonify, json)
import logging
import datetime
from jose import jwk
import registry as r
from libraries.utilities.signin import Signin
from libraries.utilities.authentication import Authentication


# Blueprint for all user and admin accounts related server api endpoints
accounts = Blueprint('accounts', __name__)


# Creates a new admin account, request from rddp
@accounts.route('/api/rddp/signup-admin', methods=['POST'])
def sign_up_admin():
    # get user input data from form
    email = request.json.get('email').lower()
    passw = request.json.get('pass')
    public_key_pem = request.json.get('public_key') # pem string
    # hash email and password
    pw_hash = Authentication.make_pw_hash(email, passw)
    # create a new entry in databse
    a_id = r.get_registry()['ADMIN'].create_admin(
        email,
        pw_hash,
        public_key_pem
    )
    # log in admin
    Signin.login(email)
    # create response
    js = {'redirect': '/emergencies'}
    return jsonify(js), 200


# Signs up a new admin user, request from rddp
@accounts.route('/api/rddp/signin-admin', methods=['POST'])
def sign_in():
    # if already logged in
    if Signin.is_loggedin():
        return redirect(url_for('main.landing'))
    # get input from form
    email = request.json.get('email').lower()
    password = request.json.get('password')
    # validate input
    error = Signin.validate_signin(email, password)
    # error response
    if error:
        return jsonify({
            'email': email,
            'password': password,
            'email_error': error.get('email_error'),
            'password_error': error.get('password_error')
        }), 400
    # login user, logout current user if any
    Signin.logout()
    user = r.get_registry()['ADMIN'].get_admin_by_email(email)
    Signin.login(email)
    # create response
    js = {
        'redirect': '/emergencies',
        'logged_in': True
    }
    return jsonify(js), 200


# Creates a new user, request from authentication server
@accounts.route('/register-user', methods=['POST'])
def register_user():
    # get user data from request
    data = request.form
    user_id = data.get('user_id')
    auth_token = data.get('auth_token')
    # add record to database
    r.get_registry()['USER'].register_user(
        user_id,
        auth_token
    )
    # create response
    js = {}
    return jsonify(js), 200


# Publish user's public key, request by app
@accounts.route('/api/app/publish-user-public-key', methods=['POST'])
def publish_user_public_key():
    # get data from request
    data = request.form
    auth_token = data.get('auth_token')
    public_key = data.get('public_key')
    # add public key to database
    r.get_registry()['USER'].publish_public_key(
        auth_token,
        public_key
    )
    # get admin, we assume there is only one admin
    admin = r.get_registry()['ADMIN'].get_admins()[0]
    # get public key of admin
    public_key_pem = admin.get('public_key_pem')
    # create response
    js = {'public_key': public_key_pem}
    return jsonify(js), 200


# Gets public key of user from db, request from rdddp
@accounts.route('/api/rddp/get-user-public-key', methods=['POST'])
def get_user_public_key():
    # get data from form
    data = request.json
    user_id = data.get('user_id')
    # get key str from db and covert to json object
    public_key_pem_str = r.get_registry()['USER'].get_public_key(user_id)
    public_key_pem = json.loads(public_key_pem_str)
    # create response
    js = {'public_key': public_key_pem}
    return jsonify(js), 200
