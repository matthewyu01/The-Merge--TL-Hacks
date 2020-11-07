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
        name: name
    })

@app.route('/teams/<name>/', methods=['GET'])
def get_team_info(name):
    return jsonify({
        name: name
    })

if __name__ == "__main__":
    app.run()
