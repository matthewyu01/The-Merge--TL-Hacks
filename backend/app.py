from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/images/<path:path>')
def get_image(path):
    return send_from_directory('images', path)


if __name__ == "__main__":
    app.run()