# -*- coding: utf-8 -*-
from flask import (
    Blueprint, render_template, url_for, request,
    redirect, session, make_response, jsonify, json)
import logging
import datetime
import registry as r
from libraries.utilities.signin import Signin
from libraries.utilities.authentication import Authentication
from libraries.utilities.utilities import Utilities

report = Blueprint('report', __name__)


@report.route('/report', methods=['POST'])
def add_report():
    timestamp = datetime.datetime.now()

    print request.form
    
    data = request.form

    # get data from form
    user_token = data.get('auth_token')
    rtype = data.get('type')
    urgency = data.get('urgency')
    year = data.get('year')
    month = data.get('month')
    day = data.get('day')
    hour = data.get('hour')
    minute = data.get('minute')
    location = data.get('location')
    description = data.get('description')

    is_anonymous = data.get('is_anonymous')
    is_res_emp = data.get('is_resp_emp')
    follow_up = data.get('follow_up_enabled')

    # TODO: error check data

    # create date object
    date = datetime.datetime(
        year=int(year),
        day=int(day),
        month=int(month),
        hour=int(hour),
        minute=int(minute)
    )
    # convert to booleans
    is_anonymous = (is_anonymous == "true")
    is_res_emp = (is_res_emp == "true")
    follow_up = (follow_up == "true")

    # add report to database
    r_id = r.get_registry()['REPORT'].record_report(
        user_token,
        timestamp,
        rtype,
        urgency,
        date,
        location,
        description,
        is_anonymous,
        is_res_emp,
        follow_up,
        False,
        False
    )

    # get reported data if not anoymous
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

    return jsonify({
        "report_id": r_id
    }), 200


@report.route('/api/rddp/report-records', methods=['GET'])
def report_records():
    # get all records
    records = r.get_registry()['REPORT'].get_non_archived_reports()
    # create response
    js = {}
    js['reports'] = list(records)
    return jsonify(js), 200


@report.route('/api/rddp/get-report-record/<report_id>', methods=['GET'])
def get_report_record(report_id):
    # get report record
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )

    # create response
    js = {}
    js['report'] = report

    return jsonify(js), 200


@report.route('/api/rddp/initiate-report-followup', methods=['POST'])
def initiate_followup():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.json    
    report_id = data.get('report_id')

    report = r.get_registry()['REPORT'].get_report(
        report_id
    )

    if not report:
        return jsonify({
            'error': "Ivalid ID"
        }), 400

    initiate_followup = True

    r.get_registry()['REPORT'].initiate_followup(
        report_id,
        initiate_followup
    )

    r.get_registry()['THREAD'].record_thread(
        report.get('type'),
        report.get('user_token'),
        report_id,
        timestamp
    )

    report = r.get_registry()['REPORT'].get_report(
        report_id
    )

    js = {'report': report}
    return jsonify(js), 200


@report.route('/api/rddp/report-followup-messages/<report_id>', methods=['GET'])
def get_messages(report_id):
    report = r.get_registry()['REPORT'].get_report(
        Utilities.safe_cast(report_id, int)
    )
    if not report:
        return jsonify({
            'error': "Ivalid ID"
        }), 400

    # get all messages
    thread = r.get_registry()['THREAD'].get_thread_by_report_id(
        report_id
    )
    messages = []
    if thread:
        messages = r.get_registry()['MESSAGE'].get_messages_of_thread(
            thread.get('id')
        )

    # create response
    js = {}
    js['messages'] = list(messages)
    return jsonify(js), 200


@report.route('/api/rddp/mark-report-as-archived', methods=['POST'])
def mark_as_archived():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.json    
    report_id = data.get('report_id')

    report = r.get_registry()['REPORT'].get_report(
        report_id
    )

    if not report:
        return jsonify({
            'error': "Ivalid ID"
        }), 400

    archived = True

    r.get_registry()['REPORT'].initiate_followup(
        report_id,
        archived,
        timestamp
    )

    js = {'redirect': '/reports'}
    return jsonify(js), 200


@report.route('/api/rddp/new-message', methods=['POST'])
def add_new_message():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.json    
    report_id = data.get('report_id')
    message = data.get('message')

    report = r.get_registry()['REPORT'].get_report(
        report_id
    )

    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400

    if not message:
        return jsonify({
            'message': message,
            'message_error': 'Invalid message'
        }), 400

    # get all messages
    thread = r.get_registry()['THREAD'].get_thread_by_report_id(
        report_id
    )
    from_admin = True
    r.get_registry()['MESSAGE'].record_message(
        thread.get('id'),
        message,
        from_admin,
        timestamp
    )

    messages = r.get_registry()['MESSAGE'].get_messages_of_thread(
        thread.get('id')
    )

    # create response
    js = {
        'messages': list(messages),
        'message': '',
        'message_error': ''
    }
    return jsonify(js), 200

    

@report.route('/send-followup-message', methods=['POST'])
def add_new_message2():
    # get data from form
    timestamp = datetime.datetime.now()

    data = request.form
    thread_id = data.get('thread_id')
    message = data.get('message')
    print thread_id

    thread = r.get_registry()['THREAD'].get_thread(
        thread_id
    )

    if not thread:
        return jsonify({
            'error': 'Invalid thread ID'
        }), 400

    if not message:
        return jsonify({
            'message_error': 'Invalid message'
        }), 400


    from_admin = False
    r.get_registry()['MESSAGE'].record_message(
        thread_id,
        message,
        from_admin,
        timestamp
    )

    messages = r.get_registry()['MESSAGE'].get_messages_of_thread(
        thread_id
    )

    # create response
    js = {
        'messages': list(messages),
    }
    return jsonify(js), 200


@report.route('/get-followup-threads', methods=['POST'])
def get_threads():
    data = request.form
    user_token = data.get('auth_token')
    print user_token

    user = r.get_registry()['USER'].get_user(
        user_token
    )
    if not user:
        return jsonify({
            'error': "Ivalid User"
        }), 400

    # get all threads of user
    threads = r.get_registry()['THREAD'].get_threads_of_user(
        user_token
    )

    # create response
    js = {}
    js['threads'] = list(threads)
    return jsonify(js), 200


@report.route('/get-followup-messages', methods=['POST'])
def get_messages2():
    data = request.form
    thread_id = data.get('thread_id')
    print thread_id

    thread = r.get_registry()['THREAD'].get_thread(
        thread_id
    )

    if not thread:
        return jsonify({
            'error': 'Invalid thread ID'
        }), 400

    # get all messages of thread
    messages = r.get_registry()['MESSAGE'].get_messages_of_thread(
        thread_id
    )

    # create response
    js = {}
    js['messages'] = list(messages)
    return jsonify(js), 200