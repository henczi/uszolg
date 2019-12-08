#!/usr/bin/env python

import json
from flask import Flask, jsonify, request
app = Flask(__name__)
import os

prefix = os.getenv('PREFIX', '/api/feedback')
print('Prefix: ' + prefix)

@app.route(prefix)
def root():
    return jsonify(status="OK"), 200

@app.route(prefix + '/send', methods=['POST'])
def send():
    fb = request.get_json()
    print(fb)
    # send mail, store db, pass to analitics, etc ..
    return jsonify(status="OK", message="Your feedback is important to us!", data=fb), 200

if __name__ == '__main__':
    app.run()