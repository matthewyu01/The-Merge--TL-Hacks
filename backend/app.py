import os
import json
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS, cross_origin

DEFAULT_LOGO = 'logos/default.jpg'

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/logos/<org>', methods=['GET'])
def get_image(org):
    if not os.path.exists(f'logos/{org}.jpg'):
        return send_file(DEFAULT_LOGO)

    return send_file(f'logos/{org}.jpg')

@app.route('/rankings/<file_name>', methods=['GET'])
def get_json(file_name):
    with open(f'rankings/{file_name}.json', 'r') as f:
        return jsonify(json.load(f))

if __name__ == "__main__":
    app.run()