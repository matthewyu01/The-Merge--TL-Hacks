from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/players/', methods=['GET'])
def get_player_list():
    return jsonify({
        'players': [{
            'name': 'Impact',
            'games': ['Valorant', 'DOTA']
        }, {
            'name': 'DoubleLift',
            'games': ['League', 'CS:GO', 'DOTA']
        }, {
            'name': 'Jensen',
            'games': ['COD']
        }, {
            'name': 'CoreJJ',
            'games': ['Valorant', 'DOTA']
        }]
    })

@app.route('/players/<name>/', methods=['GET'])
def get_player_info(name):
    return jsonify({
        'name': name
    })

@app.route('/orgs/', methods=['GET'])
def get_org_list():
    return jsonify({
        'orgs': [{
            'name': 'Organization 1',
            'games': ['Valorant', 'DOTA']
        }, {
            'name': 'Organization 2',
            'games': ['League', 'CS:GO', 'DOTA']
        }]
    })

@app.route('/orgs/<name>/', methods=['GET'])
def get_org_info(name):
    return jsonify({
        'name': name
    })

if __name__ == "__main__":
    app.run()
