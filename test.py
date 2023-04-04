from pymongo import MongoClient
from hashlib import sha256
from datetime import datetime

cluster = MongoClient("mongodb+srv://civichours:zTudxFA2GtQN8xP7@cluster0.ovv1ops.mongodb.net/?retryWrites=true&w=majority")
db = cluster["main"]
users = db["users"]
projects = db["projects"]

users.insert_one({"test": True})
projects.insert_one({"test": True})

user_in_database = users.find_one({"5":True})
print(type(user_in_database))
