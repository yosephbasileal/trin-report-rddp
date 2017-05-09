# -*- coding: utf-8 -*-

import sys
import os
_root = os.path.dirname(os.path.abspath(__file__)).split(os.path.sep)
sys.path.extend([os.path.sep.join(_root)])

# import applicaiton instance
from rddp.app import app as application

# run application
if __name__ == '__main__':
    application.run()
