# -*- coding: utf-8 -*-
from flask import (
    Blueprint, render_template, url_for, request,
    redirect, session, make_response, jsonify, json)
import logging
import datetime
import registry as r
from libraries.utilities.signin import Signin
from libraries.utilities.authentication import Authentication


emergency = Blueprint('emergency', __name__)


@emergency.route('/emergency-request', methods=['POST'])
def emergency_request():
    # get user data from POST request
    timestamp = datetime.datetime.now()
    data = request.form

    name = data.get('username')
    phone = data.get('userphone')
    id_num = data.get('userid')
    lat = data.get('latitude')
    lng = data.get('longitude')
    exp = data.get('explanation')

    # add record to database
    e_id = r.get_registry()['EMERGENCY'].record_emergency(
        timestamp,
        name,
        phone,
        id_num,
        lat,
        lng,
        False,
        exp,
        False
    )

    js = {}
    js['emergency_id'] = e_id
    return jsonify(js), 200


@emergency.route('/api/rddp/emergency-records', methods=['GET'])
def emergency_records():
    # get all records
    records = r.get_registry()['EMERGENCY'].get_non_archived_records()
    # create response
    js = {}
    js['emergencies'] = list(records)
    js['emergencies_loaded'] = True
    print "Number of records: " + str(len(list(records)))
    return jsonify(js), 200


@emergency.route('/api/rddp/get-emergency-record/<emergency_id>', methods=['GET'])
def get_emergency_record(emergency_id):
    # get emergency record
    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )
    handled_status = bool(emergency.get('handled_status'))

    # create response
    js = {}
    js['emergency'] = emergency
    js['receieved'] = handled_status

    return jsonify(js), 200


@emergency.route('/api/rddp/mark-emergency-as-recieved', methods=['POST'])
def mark_as_received():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.json    
    emergency_id = data.get('emergency_id')

    emergency = r.get_registry()['EMERGENCY'].get_status(
        emergency_id
    )

    if not emergency:
        return jsonify({
            'error': "Ivalid ID"
        }), 400

    handled_status = True

    r.get_registry()['EMERGENCY'].update_status(
        emergency_id,
        handled_status,
        timestamp
    )

    js = {'receieved': True}
    return jsonify(js), 200


@emergency.route('/check-emergency-status', methods=['POST'])
def check_emergency_status():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.form    
    emergency_id = data.get('emergency_id')

    latitude = data.get('latitude')
    longitude = data.get('longitude')

    # print "Location: " + str(longitude) + ", " + str(latitude)

    emergency = r.get_registry()['EMERGENCY'].get_status(
        emergency_id
    )
    if not emergency:
	print "No Emergency"
        return jsonify({
            'error': "Ivalid ID"
        }), 400

    print "Emergency"

    # save updated gps location in db
    r.get_registry()['EMERGENCY'].update_location(
        emergency_id,
        longitude,
        latitude,
        timestamp
    )

    # send status to phone
    handled_status = bool(emergency.get('handled_status'))
    js = {'handled_status': handled_status}
    return jsonify(js), 200


@emergency.route('/emergency-explanation', methods=['POST'])
def emergency_explanation():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.form    
    emergency_id = data.get('emergency_id')
    explanation = data.get('explanation')

    # TODO: check if valid ID

    # save explanation in db
    r.get_registry()['EMERGENCY'].update_explanation(
        emergency_id,
        explanation
    )

    js = {}
    return jsonify(js), 200


@emergency.route('/emergency-callme-checkbox', methods=['POST'])
def emergency_callme():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.form    
    emergency_id = data.get('emergency_id')

    if data.get('callme') == 'true':
        callme = True;
    else:
        callme = False

    # TODO: check if valid ID

    # save explanation in db
    r.get_registry()['EMERGENCY'].update_callme(
        emergency_id,
        callme
    )

    js = {}
    return jsonify(js), 200


@emergency.route('/api/rddp/mark-emergency-as-archived', methods=['POST'])
def mark_as_archived():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.json    
    emergency_id = data.get('emergency_id')

    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )

    if not emergency:
        return jsonify({
            'error': "Ivalid ID"
        }), 400

    archived = True

    r.get_registry()['EMERGENCY'].archive_report(
        emergency_id,
        archived,
        timestamp
    )

    js = {'redirect': '/emergencies'}
    return jsonify(js), 200