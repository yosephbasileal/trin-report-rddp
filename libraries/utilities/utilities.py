# -*- coding: utf-8 -*-


class Utilities(object):

    # safely casts to specified type
    @staticmethod
    def safe_cast(val, to_type, default=None):
        try:
            return to_type(val)
        except (ValueError, TypeError):
            return default


