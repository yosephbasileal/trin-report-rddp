# -*- coding: utf-8 -*-

from flask import (
    Blueprint, render_template, url_for, request,
    redirect, make_response, jsonify, json)
import logging
import datetime
from jose import jwk
import registry as r
from libraries.utilities.signin import Signin
from libraries.utilities.authentication import Authentication


# Main blueprint for URL mapping and rendering html templates
main = Blueprint('main', __name__)


# Routes that require redirection if not logged in
@main.route('/',  methods=['GET'])
@main.route('/emergencies',  methods=['GET'])
@main.route('/reports',  methods=['GET'])
@main.route('/home',  methods=['GET'])
def landing():
    if not Signin.is_loggedin():
        return redirect(url_for('main.login'))
    return render_template("landing.html")


# Routes that require redirection if logged in
@main.route('/signup',  methods=['GET'])
@main.route('/login',  methods=['GET'])
def login():
    if Signin.is_loggedin():
        return redirect(url_for('main.landing'))
    return render_template("landing.html")


# Route for emergency dialog
@main.route('/emergencies/<emergency_id>',  methods=['GET'])
def emergency_dialog(emergency_id):
    # TODO: check emergency id
    if not Signin.is_loggedin():
        return redirect(url_for('main.login'))
    return render_template("landing.html")


# Route for report dialog
@main.route('/reports/<report_id>',  methods=['GET'])
def report_dialog(report_id):
    # TODO: check report id
    if not Signin.is_loggedin():
        return redirect(url_for('main.login'))
    return render_template("landing.html")


# Route for signing out
@main.route('/signout')
def sign_out():
    Signin.logout()
    return redirect('/')


# Route for checking if admin is loggedin into rddp
@main.route('/check-loggedin', methods=['GET'])
def check_loggedin():
    js = {}
    js['logged_in'] = Signin.is_loggedin()
    return jsonify(js), 200
