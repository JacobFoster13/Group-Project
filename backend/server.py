#!/usr/bin/env python3

from flask import Flask, request
import json
from flask_cors import CORS
import pymongo
from dotenv import load_dotenv
import os
import passwordEncrypt
import certifi

ca=certifi.where()

load_dotenv()
DB_STRING = os.getenv("DB_STRING")

app = Flask(__name__)
client = pymongo.MongoClient(DB_STRING, tlsCAFile=ca)
db = client['pythonTest']
CORS(app)

def return_json(message):
    return json.dumps({"Message": str(message)}, indent=4)

@app.route("/login/", methods=["POST"])
def login():
    if request.method == 'POST':

        data = request.get_json()
        params = data['params']
        user = params.get('user')
        password = params.get('password')
        # print(data)
        # print(user)

        try:
            checker = next(db.users.find({'_id': str(user)}))
            
            salt = checker['salt'].encode()
            pwdEncrypt = passwordEncrypt.PasswordEncrypt(password)
            encodedBytePwd = pwdEncrypt.encodePasswordByte()
            hashedPwd = pwdEncrypt.generateHash(encodedBytePwd, salt)
            
            print(hashedPwd.decode())
            print(checker['password'])
            
            if checker['password'] == hashedPwd.decode():
                return return_json('ConfirmKey')
        except:
            return return_json("Access Denied")
    else:
        return 'LOL'

@app.route('/signup/', methods=['POST'])
def signup():
    if request.method == 'POST':

        data = request.get_json()
        params = data['params']
        user, first, last, email, password = params.get('user'), params.get('first'), params.get('last'), params.get('email'), params.get('password')

        try:
            checker = next(db.users.find({'_id': str(user)}))
            return return_json("There is already a user with this username")
        except:

            pwdEncrypt = passwordEncrypt.PasswordEncrypt(password)
            encodedBytePwd = pwdEncrypt.encodePasswordByte()
            salt = pwdEncrypt.generateSalt()
            hashedPwd = pwdEncrypt.generateHash(encodedBytePwd, salt)

            newUser = {
                '_id': user,
                'fname': first,
                'lname': last,
                'email': email,
                'password': hashedPwd.decode(),
                'salt': salt.decode(),
                'projects': list()
            }
            db.users.insert_one(newUser)
            return return_json("ConfirmKey")

@app.route('/projects/', methods=['POST'])
def projects():
    if request.method == 'POST':

        data = request.get_json()
        params = data['params']
        projectID, projectName, projectDescription, creator, users = params.get('projectID'), params.get('projectName'), params.get('projectDescription'), params.get('creator'), params.get('users')

        try:
            newUser = {
                'name': projectName,
                'description': projectDescription,
                'creator': creator,
                'users' : users,
                '_id': projectID        
            }
            db.projects.insert_one(newUser)
            return return_json("ConfirmKey")
        except:
            return return_json("Error occured")
        

# @app.route('/joinProjects/', methods=['POST'])
# def joinProjects():
#     if request.method == 'POST':

#         data = request.get_json()
#         params = data['params']
#         projectID, users = params.get('projectID'), params.get('users')
#         try:            
#             checkProject = next(db.projects.find({'_id': projectID}))
#             print("Hello" + checkProject.users[0])
#             usersArr = checkProject.users
#             usersArr.append("sg123")
#             myquery = { "_id": projectID }
#             newvalues = { "$set": { "users": usersArr }}
#             #db.projects.insert_one(newUser)
#             db.projects.update_one(myquery, newvalues)
#             return return_json("ConfirmKey")
#         except:
#             return return_json("Error occured")


if __name__ == "__main__":
    app.run(debug=True)