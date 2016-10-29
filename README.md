# RoboticsContestScoringSystem

More Info: http://www.trincoll.edu/events/robot/rules-1.html


# Setup
- cd ~
- virtualenv robotics
- source robotics/bin/activate
- cd scoring-system
- pip install -r requirements.txt
- mysql.server start
- redis-server start
- gunicorn --bind 0.0.0.0:8090 run

# Requirements:
- MySQL
- Python 2.7.3
- Redis
