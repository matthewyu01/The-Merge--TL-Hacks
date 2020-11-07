from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/players/<name>/', methods=['GET'])
def get_player_info(name):
    return jsonify({
        'name': name
    })

@app.route('/orgs/', methods=['GET'])
def get_org_list():
    return jsonify({
        'orgs': ['Org 1', 'Org 2', 'Org 3']
    })

@app.route('/orgs/<name>/', methods=['GET'])
def get_org_info(name):
    return jsonify({
        'name': name
    })

if __name__ == "__main__":
    app.run()
