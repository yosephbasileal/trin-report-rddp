# -*- coding: utf-8 -*-
from flask import (
    Blueprint, render_template, url_for, request,
    redirect, session, make_response, jsonify)
import logging
import registry as r
import datetime

main = Blueprint('main', __name__)


@main.route('/', methods=['GET', 'POST'])
def home():
    return render_template(
        "home.html"
    )


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
        latitude,
        longitude
    )

    return jsonify({}), 200
