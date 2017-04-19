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
        SentryClient.__app = Sentry(app)
        SentryClient.__client = SentryClient.__app.client
