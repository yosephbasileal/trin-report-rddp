# -*- coding: utf-8; -*-

from raven import Client
from raven.contrib.flask import Sentry


class SentryClient:
    __app = None
    __client = None

    @staticmethod
    def init(sentry_url):
        SentryClient.__client = Client(sentry_url)

    @staticmethod
    def init_flask(app):
        # app should have SENTRY_DSN set to the appropriate url in its
        # configuration
        SentryClient.__app = Sentry(app)
        SentryClient.__client = SentryClient.__app.client
