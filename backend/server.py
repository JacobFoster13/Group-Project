#!/usr/bin/env python3

from flask import Flask, request
import json
from flask_cors import CORS
import pymongo
from dotenv import load_dotenv
import os

load_dotenv()
DB_STRING = os.getenv("DB_STRING")

app = Flask(__name__)
client = pymongo.MongoClient(DB_STRING)
db = client['pythonTest']
CORS(app)

@app.route("/login/", methods=["GET", "POST"])
def login():
    if request.method == 'GET':
        args = request.args
        user = args.get('user')
        print(user)
        password = args.get('password')
        try:
            checker = next(db.users.find({'_id': str(user)}))
            if checker['password'] == password:
                return json.dumps({'message': 'ConfirmKey'}, indent=4)
        except:
            return json.dumps({"Message": "Access Denied"}, indent=4)
    else:
        return 'LOL'


if __name__ == "__main__":
    app.run(debug=True)