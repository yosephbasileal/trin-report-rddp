# -*- coding: utf-8 -*-
from flask import (
    Blueprint, render_template, url_for, request,
    redirect, session, make_response)
import registry as r

main = Blueprint('main', __name__)


@main.route('/', methods=['GET', 'POST'])
def home():
    return render_template(
        "home.html"
    )