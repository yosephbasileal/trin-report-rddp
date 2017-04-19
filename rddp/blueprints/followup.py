# -*- coding: utf-8 -*-

from flask import (
    Blueprint, request, jsonify, json)
import datetime
import registry as r


# Blueprint for all followup related server api endpoints
followup = Blueprint('followup', __name__)


# Adds new message to followup chat, request by rddp
@followup.route('/api/rddp/add-new-message', methods=['POST'])
def add_new_message_rddp():
    # get timstamp
    timestamp = datetime.datetime.now()
    # get data from form
    data = request.json
    report_id = data.get('report_id')
    message_user = data.get('message_user')  # encrypted with user's key
    message_admin = data.get('message_admin')  # encrypted with admin's key
    # get report record
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    # validate report id
    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400
    if not message_user or not message_admin:
        return jsonify({
            'error': 'Invalid message'
        }), 400
    # save data in db, message gets stored in two tables
    from_admin = True
    r.get_registry()['MESSAGE_ADMIN'].record_message(
        report_id,
        message_admin,
        from_admin,
        timestamp
    )
    r.get_registry()['MESSAGE_USER'].record_message(
        report_id,
        message_user,
        from_admin,
        timestamp
    )
    # get all messages from admin table
    messages = r.get_registry()['MESSAGE_ADMIN'].get_messages(
        report_id
    )
    # create response
    js = {
        'messages': list(messages),
        'message': ''
    }
    return jsonify(js), 200


# Adds new message to followup chat, request by app
@followup.route('/api/app/add-new-message', methods=['POST'])
def add_new_message_app():
    # get timstamp
    timestamp = datetime.datetime.now()
    # get data from form
    # data stored in .json if app is using tor
    data = request.form
    if not data:
        data = request.json
    report_id = data.get('report_id')
    message_user = data.get('message_user')  # encrypted with user's key
    message_admin = data.get('message_admin')  # encrypted with admin's key
    # get report record
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    # validate report id
    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400
    if not message_user or not message_admin:
        return jsonify({
            'error': 'Invalid message'
        }), 400
    # save data in db, message gets stored in two tables
    from_admin = False
    r.get_registry()['MESSAGE_ADMIN'].record_message(
        report_id,
        message_admin,
        from_admin,
        timestamp
    )
    r.get_registry()['MESSAGE_USER'].record_message(
        report_id,
        message_user,
        from_admin,
        timestamp
    )
    # get all messages from user table
    messages = r.get_registry()['MESSAGE_USER'].get_messages(
        report_id
    )
    # create response
    js = {
        'messages': list(messages),
    }
    return jsonify(js), 200


# Get all followup messages of report from admin table, request by rddp
@followup.route('/api/rddp/followup-messages/<report_id>', methods=['GET'])
def get_messages_rddp(report_id):
    # get report record
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    # validate report id
    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400
    # get all messages of current report from admin table
    messages = r.get_registry()['MESSAGE_ADMIN'].get_messages(
        report_id
    )

    # create response
    js = {}
    js['messages'] = list(messages)
    return jsonify(js), 200


# Get all followup messages of report from user table, request by app
@followup.route('/api/app/followup-messages', methods=['POST'])
def get_messages_app():
    # get data from form
    # data stored in .json if app is using tor
    data = request.form
    if not data:
        data = request.json
    report_id = data.get('report_id')
    # get report record
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    # validate report id
    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400
    # get all messages of current report from user table
    messages = r.get_registry()['MESSAGE_USER'].get_messages(
        report_id
    )
    # create response
    js = {}
    js['messages'] = list(messages)
    return jsonify(js), 200
