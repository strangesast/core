from python:3.8
workdir /app
copy timeclock/requirements.txt .
run pip install -r requirements.txt
copy timeclock .
cmd ["python3.8", "-u", "daemon.py"]
