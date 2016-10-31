# -*- coding: utf-8 -*-
from flask import (
    Blueprint, render_template, url_for, request,
    redirect, session, make_response, jsonify)
import logging
import registry as r

main = Blueprint('main', __name__)


@main.route('/', methods=['GET', 'POST'])
def home():
    logging.info("Home page loading...")
    return render_template(
        "home.html"
    )


@main.route('/emergency', methods=['POST'])
def emergency():
    logging.info("Emergency request received")
    return jsonify({}), 200
