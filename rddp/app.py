# -*- coding: utf-8 -*-

import os
import logging
from datetime import datetime
import hashlib
from initialize_registry import load_registry
from flask import Flask, request
from werkzeug.wsgi import SharedDataMiddleware
load_registry()

_root = os.path.abspath(os.path.join(os.path.dirname(__file__),".."))

app = Flask('trin_report_rddp')
app.debug = True
app.secret_key = '9dBrJXZMW8E44yfODtLuxp5f0Yz2cFfPfUe2Cs2n'

APP_NAME = 'trin_report_rddp'

app.config.update(
    APP_SESSION_NAME='trin_report_rddp'
)

if app.config.get('ENV') == 'development':
    cacheStatic = False
else:
    cacheStatic = True

app.root_path = _root

app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/static': os.path.join(os.path.dirname(__file__), 'static'),
}, cache=cacheStatic)

# blueprints and views
from blueprints.main import main
app.register_blueprint(main)

def _get_etag():
    """
    Set an eTag value for the current page
    SHA1 should generate well-behaved etags
    The values that make up the string used for the ETag value are:
    the script root value
    the request path
    the current timestamp
    """
    now = datetime.utcnow().isoformat()
    etag_src = "%s--%s-%s" % (request.script_root, request.path, now,)
    etag = hashlib.sha1(etag_src.encode('utf8', 'replace')).hexdigest()
    return etag


@app.after_request
def cache_control(response):
    max_age = 1
    cache_control_str = "max-age=%s, private, must-revalidate" % max_age
    response.headers.add("Cache-Control", cache_control_str)
    etag = _get_etag()
    response.set_etag(etag)
    return response

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    logging.info("System started")
    app.run()
