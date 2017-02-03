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

@main.route('/emergency/<emergency_id>',  methods=['GET'])
def emergency_dialog(emergency_id):
    if not Signin.is_loggedin():
        return redirect(url_for('main.login'))
    return render_template("landing.html")


@main.route('/report-records', methods=['GET'])
def report_records():
    # get all records
    records = r.get_registry()['REPORT'].get_all_reports()
    # create response
    js = {}
    js['reports'] = list(records)
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


@main.route('/test')
def test():
    print 'Test called from app'
    print request.remote_addr
    return "thank you"


@main.route('/check-loggedin', methods=['GET'])
def check_loggedin():
    js = {}
    js['logged_in'] = Signin.is_loggedin()
    return jsonify(js), 200


@main.route('/register-user', methods=['POST'])
def register_user():
    # get user data from POST request
    data = request.form

    user_id = data.get('user_id')
    auth_token = data.get('auth_token')

    # add record to database
    r.get_registry()['USER'].register_user(
        user_id,
        auth_token
    )

    res = {}
    return jsonify(res), 200


@main.route('/report', methods=['POST'])
def add_report():
    # get user data from POST request
    timestamp = datetime.datetime.now()
    data = request.form

    # get data from form
    urgency = data.get('urgency')
    year = data.get('year')
    month = data.get('month')
    day = data.get('day')
    hour = data.get('hour')
    minute = data.get('minute')
    location = data.get('location')
    ttype = data.get('type')
    is_anonymous = data.get('is_anonymous')
    follow_up = data.get('follow_up_enabled')

    # process data
    date = datetime.datetime(
        year=int(year),
        day=int(day),
        month=int(month),
        hour=int(hour),
        minute=int(minute)
    )
    is_anonymous = (is_anonymous == "true")
    follow_up = (follow_up == "true")

    created = datetime.datetime.now()

    # add report to database
    r_id = r.get_registry()['REPORT'].record_report(
        created,
        urgency,
        date,
        location,
        ttype,
        is_anonymous,
        follow_up
    )

    if not is_anonymous:
        name = data.get("username")
        dorm = data.get("userdorm")
        phone = data.get("userphone")
        email = data.get("useremail")
        id_num = data.get("userid")

        r.get_registry()['REPORT'].add_reporter(
            r_id,
            name,
            dorm,
            email,
            phone,
            id_num
        )

    return jsonify({"status": "ok"}), 200


@main.route('/emergency-request', methods=['POST'])
def emergency_request():
    # get user data from POST request
    timestamp = datetime.datetime.now()
    data = request.form

    name = data.get('username')
    dorm = data.get('userdorm')
    phone = data.get('userphone')
    email = data.get('useremail')
    id_num = data.get('id_num')
    lat = data.get('latitude')
    lng = data.get('longitude')

    # add record to database
    e_id = r.get_registry()['EMERGENCY'].record_emergency(
        timestamp,
        name,
        dorm,
        phone,
        email,
        id_num,
        lat,
        lng,
        'Not Received'
    )

    js = {}
    js['emergency_id'] = e_id
    return jsonify(js), 200


@main.route('/emergency-records', methods=['GET'])
def emergency_records():
    # get all records
    records = r.get_registry()['EMERGENCY'].get_all_records()
    # create response
    js = {}
    js['emergencies'] = list(records)
    js['emergencies_loaded'] = True
    return jsonify(js), 200


@main.route('/get-emergency-record/<emergency_id>', methods=['GET'])
def get_emergency_record(emergency_id):
    # get emergency record
    record = r.get_registry()['EMERGENCY'].get_emergency(emergency_id)
    # create response
    js = {}
    js['emergency'] = record
    js['data_loaded'] = True
    if record.get('status') == 'Received':
        js['receieved'] = True
    return jsonify(js), 200


@main.route('/mark-emergency-as-recieved', methods=['POST'])
def mark_as_received():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.json    
    emergency_id = data.get('emergency_id')

    status = "Received"

    r.get_registry()['EMERGENCY'].update_status(
        emergency_id,
        status,
        timestamp
    )

    js = {'receieved': True}
    return jsonify(js), 200


@main.route('/check-emergency-status', methods=['POST'])
def check_emergency_status():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.form    
    emergency_id = data.get('emergency_id')

    # TODO: do something with new location
    lat = data.get('latitude')
    lng = data.get('longitude')

    status = r.get_registry()['EMERGENCY'].get_status(
        emergency_id
    )

    if not status:
        return jsonify({
            'error': "Ivalid ID"
        }), 400


    js = {'status': status.get('status')}
    return jsonify(js), 200
