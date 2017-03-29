# -*- coding: utf-8 -*-

import datetime
from boto.s3.key import Key
from boto.s3.connection import S3Connection
from constants import settings as const


class S3Client(object):

    @staticmethod
    def upload_file(file_str, file_key):
        # connect to AWS S3
        s3 = S3Connection(
            const.AWS_ACCESS_KEY_ID,
            const.AWS_SECRET_ACCESS_KEY
        )

        # get a handle to the S3 bucket
        bucket_name = const.S3_BUCKET
        bucket = s3.get_bucket(bucket_name)
        k = Key(bucket)

        # Use Boto to upload the file to the S3 bucket
        k.key = file_key
        k.set_contents_from_string(file_str)
        k.set_canned_acl('public-read')


    @staticmethod
    def get_file_url(key):
        s3 = S3Connection(
            const.AWS_ACCESS_KEY_ID,
            const.AWS_SECRET_ACCESS_KEY
        )
        bucket_name = const.S3_BUCKET
        bucket = s3.get_bucket(bucket_name)
        k = bucket.get_key(key)
        url = k.generate_url(0, query_auth=False, force_http=True)
        return url


    @staticmethod
    def get_file_content(key):
        s3 = S3Connection(
            const.AWS_ACCESS_KEY_ID,
            const.AWS_SECRET_ACCESS_KEY
        )
        bucket_name = const.S3_BUCKET
        bucket = s3.get_bucket(bucket_name)
        k = bucket.get_key(key)
        return k.get_contents_as_string()
