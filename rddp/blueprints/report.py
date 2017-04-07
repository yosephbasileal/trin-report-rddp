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
from libraries.s3_client import S3Client as S3

report = Blueprint('report', __name__)


@report.route('/report', methods=['POST'])
def add_report():
    timestamp = datetime.datetime.now()

    #print request.form
    #print request.json
    #print request.data

    data = request.form

    if not data:
        print 'not data'
        data = request.json

    # get data from form
    rtype = data.get('type')
    urgency = data.get('urgency')
    date = data.get('timestamp')
    location = data.get('location')
    description = data.get('description')

    is_anonymous = data.get('is_anonymous')
    is_res_emp = data.get('is_resp_emp')
    follow_up = data.get('follow_up_enabled')

    report_id = data.get('report_id')
    user_pub_key = data.get('public_key')

    # TODO: error check data

    date = datetime.datetime.strptime(
         date, '%a, %d %b %Y %H:%M:%S %Z'
    )

    # convert to booleans
    is_anonymous = (is_anonymous == "true")
    is_res_emp = (is_res_emp == "true")
    follow_up = (follow_up == "true")

    # get images and upload to s3
    images_count = data.get("images_count")
    images_iv = data.get("images_iv")
    images_key = data.get('images_key')
    print images_count
    print images_iv
    print images_key
    i = 1
    while i <= int(images_count):
        # save data except image in local db
        content = ""  # image too big to be stored locally
        i_id = r.get_registry()['IMAGE'].record_image(
            report_id,
            content,
            images_iv,
            images_key
        )

        # construct s3 key and save locally
        key_s3 = report_id + "_" + str(i_id)
        r.get_registry()['IMAGE'].update_key_s3(
            i_id,
            key_s3
        )
        print "key: " + key_s3
        
        # upload images_iv
        cipher_image = data.get("image"+str(i))
        S3.upload_file(cipher_image, key_s3)
        i = i+1;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        

    # TODO test image upload
    # image_str = data.get('image')
    # image_key = data.get('image_key')
    # image_iv = data.get('image_iv')
    # #print image_str
    # print image_key
    # print image_iv
    # S3.upload_file(image_str, report_id)


    # add report to database
    archived = False
    followup_initiated = False
    r_id = r.get_registry()['REPORT'].record_report(
        report_id,
        user_pub_key,
        timestamp,
        rtype,
        urgency,
        date,
        location,
        description,
        is_anonymous,
        is_res_emp,
        follow_up,
        archived,
        followup_initiated,
        images_key
    )

    # get reported data
    # if anonymous, these empty strings when decrypted
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

    print report_id 

    return jsonify({
        "succeeded": True
    }), 200

@report.route('/api/rddp/report-records', methods=['GET'])
def get_report_records():
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

    # get images
    images = r.get_registry()['IMAGE'].get_images(
        report_id
    )

    # create response
    js = {}
    js['report'] = report
    return jsonify(js), 200


@report.route('/api/rddp/report-images/<report_id>', methods=['GET'])
def get_report_images(report_id):
    # get images
    images = r.get_registry()['IMAGE'].get_images(
        report_id
    )

    for image in images:
        image['image'] = S3.get_file_content(
            image.get('key_s3')
        )

    # create response
    js = {}
    js['images'] = images
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

    r.get_registry()['REPORT'].archive_report(
        report_id,
        archived,
        timestamp
    )

    js = {'redirect': '/reports'}
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
            'error': "Ivalid report ID"
        }), 400

    initiate_followup = True

    r.get_registry()['REPORT'].initiate_followup(
        report_id,
        initiate_followup
    )

    report = r.get_registry()['REPORT'].get_report(
        report_id
    )

    js = {'report': report}
    return jsonify(js), 200


# adds new message from admin's RDDP portal to follow up chat
@report.route('/api/rddp/add-new-message', methods=['POST'])
def add_new_message_rddp():
    # get timstamp
    timestamp = datetime.datetime.now()

    # get data from form
    data = request.json    
    report_id = data.get('report_id')
    # encrypted with user's public key
    message_user = data.get('message_user')
    # encrypted with admin's public key
    message_admin = data.get('message_admin')

    # check if valid report id
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400
    if not message_user or not message_admin:
        return jsonify({
            'error': 'Invalid message'
        }), 400

    # save data in db, each message gets stored in both dbs
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

    
@report.route('/api/app/add-new-message', methods=['POST'])
def add_new_message_app():
    # get timstamp
    timestamp = datetime.datetime.now()

    # get data from form
    data = request.form
    if not data:
        data = request.json

    report_id = data.get('report_id')
    # encrypted with user's public key
    message_user = data.get('message_user')
    # encrypted with admin's public key
    message_admin = data.get('message_admin')

    # check if valid report id
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400
    if not message_user or not message_admin:
        return jsonify({
            'error': 'Invalid message'
        }), 400


    # save data in db, each message gets stored in both dbs
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

    messages = r.get_registry()['MESSAGE_USER'].get_messages(
        report_id
    )

    # create response
    js = {
        'messages': list(messages),
    }
    return jsonify(js), 200

@report.route('/api/app/get-report-thread', methods=['POST'])
def get_report_thread():
    data = request.form
    report_id = data.get('report_id')
    print report_id

    # get report thread
    thread = r.get_registry()['THREAD'].get_thread(
        report_id
    )

    if not thread:
        js = {}
        js['initiated'] = False
        return jsonify(js), 200

    # get all messages of thread
    messages = r.get_registry()['MESSAGE'].get_messages_of_thread(
        report_id
    )
    thread['messages'] = messages

    # create response
    js = {}
    js['initiated'] = True
    js['thread'] = thread

    return jsonify(js), 200


@report.route('/api/rddp/report-followup-messages/<report_id>', methods=['GET'])
def get_messages_rddp(report_id):
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    if not report:
        return jsonify({
            'error': "Ivalid report ID"
        }), 400


    messages = r.get_registry()['MESSAGE_ADMIN'].get_messages(
        report_id
    )

    # create response
    js = {}
    js['messages'] = list(messages)
    return jsonify(js), 200


@report.route('/api/app/report-followup-messages', methods=['POST'])
def get_messages_app():
    data = request.form

    report_id = data.get('report_id')

    report = r.get_registry()['REPORT'].get_report(
        report_id
    )

    if not report:
        return jsonify({
            'error': 'Invalid report ID'
        }), 400

    # get all messages of thread
    messages = r.get_registry()['MESSAGE_USER'].get_messages(
        report_id
    )

    # create response
    js = {}
    js['messages'] = list(messages)
    return jsonify(js), 200


@report.route('/test-file', methods=['GET'])
def test_file():
    key = "ea117002b4d36323e96c41a92a5918aab391867098a58b204bc025be43d685df"

    file = S3.get_file_content(key)

    # create and return response
    #res = make_response(file.decode('base64'))  # use this if not encrypted
    #es.headers['Content-Type'] = 'image/*'
    #res.headers['Content-Disposition'] = \
    #        'inline; filename=%s.jpg' % key
    #return res
    return file


@report.route('/get-image/<img_key>', methods=['GET'])
def get_image(img_key):
    print 'image key: ' + img_key

    file = S3.get_file_content(img_key)

    # create and return response
    #res = make_response(file.decode('base64'))  # use this if not encrypted
    #es.headers['Content-Type'] = 'image/*'
    #res.headers['Content-Disposition'] = \
    #        'inline; filename=%s.jpg' % key
    #return res
    return file