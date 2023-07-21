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

def return_json(message):
    return json.dumps({"Message": str(message)}, indent=4)

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
                return return_json('ConfirmKey')
        except:
            return return_json("Access Denied")
    else:
        return 'LOL'

@app.route('/signup/', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        args = request.args
        user, first, last, email, password = args['user'], args['first'], args['last'], args['email'], args['password']
        try:
            checker = next(db.users.find({'_id': str(user)}))
            return return_json("There is already a user with this username")
        except:
            newUser = {
                '_id': user,
                'fname': first,
                'lname': last,
                'email': email,
                'password': password,
                'projects': list()
            }
            db.users.insert_one(newUser)
            return return_json("ConfirmKey")


if __name__ == "__main__":
    app.run(debug=True)