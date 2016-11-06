# -*- coding: utf-8 -*-
from flask import (
    Blueprint, render_template, url_for, request,
    redirect, session, make_response, jsonify)
import logging
import datetime
import registry as r
from libraries.utilities.signin import Signin

main = Blueprint('main', __name__)

@main.route('/',  methods=['GET'])
def landing():
    if not Signin.is_loggedin():
        return redirect(url_for('main.login'))
    return render_template("landing.html")

@main.route('/login',  methods=['GET'])
def login():
    if Signin.is_loggedin():
        return redirect(url_for('main.landing'))
    return render_template("landing.html")

@main.route('/emergency', methods=['GET', 'POST'])
def emergency():
    if request.method == 'GET':
        records = r.get_registry()['EMERGENCY'].get_all_records()
        return render_template('temp.html', records=records)

    # get user data from POST request
    timestamp = datetime.datetime.now()
    data = request.form

    lat = data.get('latitude')
    lng = data.get('longitude')

    # add record to database
    r.get_registry()['EMERGENCY'].record_emergency(
        timestamp,
        lat,
        lng
    )

    return jsonify({}), 200


@main.route('/emergency-records', methods=['GET'])
def emergency_records():
    # get all records
    records = r.get_registry()['EMERGENCY'].get_all_records()
    # create response
    js = {}
    js['records'] = list(records)
    return jsonify(js), 200


@main.route('/signin', methods=['POST'])
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

    # response
    return jsonify({
        'redirect': '/',
        'logged_in': True
    }), 200


@main.route('/signout')
def sign_out():
    Signin.logout()
    return redirect('/')


@main.route('/check-loggedin', methods=['GET'])
def check_loggedin():
    js = {}
    js['logged_in'] = Signin.is_loggedin()
    return jsonify(js), 200


@main.route('/register-user', methods=['POST'])
def register_user():
    # get user data from POST request
    data = request.form

    user_id = data.get('auth_user_id')
    auth_token = data.get('auth_token')

    # add record to database
    r.get_registry()['USER'].register_user(
        user_id,
        auth_token
    )

    res = {}
    return jsonify(res), 200
