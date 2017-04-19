# -*- coding: utf-8 -*-

from flask import (
    Blueprint, request, jsonify, json)
import datetime
import registry as r
from libraries.s3_client import S3Client as S3


# Blueprint for all report related server api endpoints
report = Blueprint('report', __name__)


# New incident report, request from app
@report.route('/api/app/report-request', methods=['POST'])
def add_report():
    # get timestamp
    timestamp = datetime.datetime.now()
    # get data from form
    # data stored in .json if app is using tor
    data = request.form
    if not data:
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
    images_count = int(data.get("images_count"))
    images_iv = data.get("images_iv")
    images_key = data.get('images_key')
    name = data.get("username")
    dorm = data.get("userdorm")
    phone = data.get("userphone")
    email = data.get("useremail")
    id_num = data.get("userid")
    # get date object from string
    date = datetime.datetime.strptime(
         date, '%a, %d %b %Y %H:%M:%S EDT'
    )
    # convert to booleans
    is_anonymous = (is_anonymous == "true")
    is_res_emp = (is_res_emp == "true")
    follow_up = (follow_up == "true")
    # upload images to s3
    for i in range(1, images_count + 1):
        # save image meta data locally
        content = ""
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
        # upload image content to s3
        cipher_image = data.get("image" + str(i))
        S3.upload_file(cipher_image, key_s3)
    # add report to database
    archived = False
    followup_initiated = True
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
    # add reporter's data to db, # if anonymous, these have values 'n/a'
    r.get_registry()['REPORT'].add_reporter(
        r_id,
        name,
        dorm,
        email,
        phone,
        id_num
    )
    # create response
    js = {}
    js['succeeded'] = True
    return jsonify(js), 200


# Get all non-archived reports, request from rddp
@report.route('/api/rddp/report-records', methods=['GET'])
def get_report_records():
    # get all non-archived records
    records = r.get_registry()['REPORT'].get_non_archived_reports()
    # create response
    js = {}
    js['reports'] = list(records)
    return jsonify(js), 200


# Get a report record, request from rddp
@report.route('/api/rddp/get-report-record/<report_id>', methods=['GET'])
def get_report_record(report_id):
    # get report record
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    # validate report id
    if not report:
        return jsonify({
            'error': "Invalid report ID"
        }), 400
    # get images meta data
    images = r.get_registry()['IMAGE'].get_images(
        report_id
    )
    # create response
    js = {}
    js['report'] = report
    return jsonify(js), 200


# Get images of report from AWS S3, request by rddp
@report.route('/api/rddp/report-images/<report_id>', methods=['GET'])
def get_report_images(report_id):
    # get list of image meta data for current report
    images = r.get_registry()['IMAGE'].get_images(
        report_id
    )
    # get image content from s3
    for image in images:
        image['image'] = S3.get_file_content(
            image.get('key_s3')
        )
    # create response
    js = {}
    js['images'] = images
    return jsonify(js), 200


# Mark a report as archived, request by rddp
@report.route('/api/rddp/mark-report-as-archived', methods=['POST'])
def mark_as_archived():
    # get timestamp
    timestamp = datetime.datetime.now()
    # get data from form
    data = request.json
    report_id = data.get('report_id')
    # get report record
    report = r.get_registry()['REPORT'].get_report(
        report_id
    )
    # validate report id
    if not report:
        return jsonify({
            'error': "Invalid report ID"
        }), 400
    # update 'archived' column in db
    archived = True
    r.get_registry()['REPORT'].archive_report(
        report_id,
        archived,
        timestamp
    )
    # create response
    js = {}
    js['redirect'] = '/reports'
    return jsonify(js), 200
