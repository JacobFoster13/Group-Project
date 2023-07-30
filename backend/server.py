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
        projectID, projectName, projectDescription, creator, user = int(params.get('projectID')), params.get('projectName'), params.get('projectDescription'), params.get('creator'), params.get('user')

        try:
            newProject = {
                'name': projectName,
                'description': projectDescription,
                'creator': creator,
                'users': [user],  # Wrap 'users' in a list to make it a list of users
                '_id': projectID        
            }
            db.projects.insert_one(newProject)
            
            # Update the user's document in the 'users' collection to include the new projectID
            db.users.update_one(
                {'_id': creator},  # Use {'_id': creator} instead of {'_id': users'}
                {'$push': {'projects': projectID}}
            )
            
            return return_json("ConfirmKey")
        except:
            return return_json("Error occurred")

        

@app.route("/join_project/", methods=["POST"])
def join_project():
    if request.method == 'POST':
        data = request.get_json()
        params = data['params']
        user = params.get('user')  # Corrected key to 'user'
        project_id = int(params.get('projectID'))
        print(user)
        try:
            project = db.projects.find_one({'_id': project_id})  # Use find_one() instead of find()

            if not project:
                return return_json("Project does not exist")
            elif user in project['users']:
                print(project['users'])
                return return_json("User is already in the project")

            db.projects.update_one(
                {'_id': project_id},
                {'$push': {'users': user}}
            )
            db.users.update_one(
                {'_id': user},
                {'$push': {'projects': project_id}}
            )
            return return_json("User successfully joined the project")
        except:
            return return_json("Error occurred while joining the project")
    else:
        return 'LOL'

@app.route("/get_user_projects/", methods=["POST"])
def get_user_projects():
    if request.method == 'POST':
        data = request.get_json()
        params = data['params']
        user = params.get('user')

        try:

            collection = db.projects

            # Query find in the collection HWSet1
            result = collection.find({'users':user})

            documents_list = list(result)
            print(documents_list)

            if (len(documents_list) == 0):
                return None
            else:
                dataTable = []
                counter = 1
                for document in documents_list:
                    rows = {'id':counter, 'projectID': document['_id'], 'projectName': document['name'], 'hwSet1': document['hardware'][0], 'hwSet2': document['hardware'][1]}
                    dataTable.append(rows)
                    counter += 1

                print(dataTable)
                return dataTable
        except:
            return return_json("Error occurred while loading the projects")
    else:
        return 'LOL'

if __name__ == "__main__":
    app.run(debug=True)
