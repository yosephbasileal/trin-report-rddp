#!/usr/bin/env python
# -*- coding: utf-8 -*-


class Registry(dict):
    """ A lockable dictionary, intended to be used to store
        references to external resources """
    def __init__(self):
        self._locked = False
        dict.__init__(self)

    def lock(self):
        self._locked = True

    def is_locked(self):
        return self._locked

    def __setitem__(self, key, val):
        assert not self._locked
        dict.__setitem__(self, key, val)

THE_REGISTRY = Registry()


def get_registry():
    return THE_REGISTRY
