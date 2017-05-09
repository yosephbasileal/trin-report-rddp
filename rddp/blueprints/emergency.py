# -*- coding: utf-8 -*-

from flask import (
    Blueprint, request, jsonify, json)
import datetime
import registry as r


# Blueprint for all emergency related server api endpoints
emergency = Blueprint('emergency', __name__)


# New emergency request, request from app
@emergency.route('/api/app/emergency-request', methods=['POST'])
def emergency_request():
    # get timestamp
    timestamp = datetime.datetime.now()
    # get data from form
    data = request.form
    name = data.get('username')
    phone = data.get('userphone')
    id_num = data.get('userid')
    email = data.get('useremail')
    dorm = data.get('userdorm')
    lat = data.get('latitude')
    lng = data.get('longitude')
    exp = data.get('explanation')
    # default boolean values
    handled_status = False
    archived = False
    done = False
    # add record to database
    e_id = r.get_registry()['EMERGENCY'].record_emergency(
        timestamp,
        name,
        phone,
        id_num,
        email,
        dorm,
        lat,
        lng,
        handled_status,
        exp,
        archived,
        done
    )
    # create response
    js = {}
    js['emergency_id'] = e_id
    return jsonify(js), 200


# Update gps location, check emergency status, request from app
@emergency.route('/api/app/update-emergency-status', methods=['POST'])
def update_emergency_status():
    # get timestamp
    timestamp = datetime.datetime.now()
    # get data from form
    data = request.form
    emergency_id = data.get('emergency_id')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    # get emergency record
    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )
    # validate emergency id
    if not emergency:
        print "Invalid emergency ID: " + emergency_id
        return jsonify({
            'error': "Invalid emergency ID"
        }), 400
    # save updated gps location in db
    r.get_registry()['EMERGENCY'].update_location(
        emergency_id,
        longitude,
        latitude,
        timestamp
    )
    # get updates status
    handled_status = bool(emergency.get('handled_status'))
    # create response
    js = {}
    js['handled_status'] = handled_status
    return jsonify(js), 200


# Get updated explanation from phone, request from app
@emergency.route('/api/app/emergency-explanation', methods=['POST'])
def emergency_explanation():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.form
    emergency_id = data.get('emergency_id')
    explanation = data.get('explanation')
    # get emergency record
    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )
    # validate emergency id
    if not emergency:
        print "Invalid emergency ID: " + emergency_id
        return jsonify({
            'error': "Invalid emergency ID"
        }), 400
    # save explanation in db
    r.get_registry()['EMERGENCY'].update_explanation(
        emergency_id,
        explanation
    )
    # create response
    js = {}
    return jsonify(js), 200


# Get updated 'call me' status from phone, request from app
@emergency.route('/api/app/emergency-callme-checkbox', methods=['POST'])
def emergency_callme():
    # get data from form
    timestamp = datetime.datetime.now()
    data = request.form
    emergency_id = data.get('emergency_id')
    callme = data.get('callme')
    # get emergency record
    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )
    # validate emergency id
    if not emergency:
        print "Invalid emergency ID: " + emergency_id
        return jsonify({
            'error': "Invalid emergency ID"
        }), 400
    # convert to boolean
    callme = (callme == 'true')
    # save in db
    r.get_registry()['EMERGENCY'].update_callme(
        emergency_id,
        callme
    )
    # create response
    js = {}
    return jsonify(js), 200


# Marks emergency request as done, request from app
@emergency.route('/api/app/emergency-done', methods=['POST'])
def mark_as_done():
    # get data from form
    data = request.form
    emergency_id = data.get('emergency_id')
    # get emergency record
    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )
    # validate emergency id
    if not emergency:
        print "Invalid emergency ID: " + emergency_id
        return jsonify({
            'error': "Invalid emergency ID"
        }), 400
    # update 'done' column in db
    done = True
    r.get_registry()['EMERGENCY'].mark_as_done(
        emergency_id,
        done
    )
    # create response
    js = {}
    return jsonify(js), 200


# Get all non-archived emergency records, request from rddp
@emergency.route('/api/rddp/emergency-records', methods=['GET'])
def emergency_records():
    # get all non-archived records
    records = r.get_registry()['EMERGENCY'].get_non_archived_records()
    # create response
    js = {}
    js['emergencies'] = list(records)

    return jsonify(js), 200


# Get all new emergency records not sent to rddp in previous request
@emergency.route('/api/rddp/emergency-records-update', methods=['POST'])
def emergency_records_update():
    # get list of ids of current rendered emergency requests
    data = request.json
    cur_list = data.get('current_list_ids')
    # get all records
    records = r.get_registry()['EMERGENCY'].get_non_archived_records()
    # separate old and new records
    # this is done so that browser wont have to decrypt already decrypted
    # records
    new_records = [rec for rec in records if rec.get('id') not in cur_list]
    old_records = [rec for rec in records if rec.get('id') in cur_list]
    # create response
    js = {}
    js['new_emergencies'] = new_records
    js['old_emergencies'] = old_records
    js['emergencies'] = list(records)
    return jsonify(js), 200


# Mark emergency record as received, request from rddp
@emergency.route('/api/rddp/mark-emergency-as-recieved', methods=['POST'])
def mark_as_received():
    # get timestamp
    timestamp = datetime.datetime.now()
    # get data from form
    data = request.json
    emergency_id = data.get('emergency_id')
    # get emergency record
    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )
    # validate emergency id
    if not emergency:
        print "Invalid emergency ID: " + emergency_id
        return jsonify({
            'error': "Invalid emergency ID"
        }), 400
    # update 'handled' column in db
    handled_status = True
    r.get_registry()['EMERGENCY'].update_status(
        emergency_id,
        handled_status,
        timestamp
    )
    # create response
    js = {}
    js['receieved'] = True
    return jsonify(js), 200


# Mark emergency record as archived, request from rddp
@emergency.route('/api/rddp/mark-emergency-as-archived', methods=['POST'])
def mark_as_archived():
    # get timestamp
    timestamp = datetime.datetime.now()
    # get data from form
    data = request.json
    emergency_id = data.get('emergency_id')
    # get emergency record
    emergency = r.get_registry()['EMERGENCY'].get_emergency(
        emergency_id
    )
    # validate emergency id
    if not emergency:
        print "Invalid emergency ID: " + emergency_id
        return jsonify({
            'error': "Invalid emergency ID"
        }), 400
    # update 'archived' column in db
    archived = True
    r.get_registry()['EMERGENCY'].archive_report(
        emergency_id,
        archived,
        timestamp
    )
    # create response
    js = {}
    js['redirect'] = '/home'
    return jsonify(js), 200
