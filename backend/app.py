import os
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

@app.route('/json/<file_name>', methods=['GET'])
def get_json(file_name):
    return send_file(f'json/{file_name}')

if __name__ == "__main__":
    app.run()