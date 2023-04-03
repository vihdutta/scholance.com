from pymongo import MongoClient
from hashlib import sha256

cluster = MongoClient("mongodb+srv://civichours:zTudxFA2GtQN8xP7@cluster0.ovv1ops.mongodb.net/?retryWrites=true&w=majority")
db = cluster["main"]
collection = db["users"]

post = {"_id":collection.count_documents({}), 
            "name":"BOO",
            "password":sha256("BIES".encode('utf-8')).hexdigest(),
            "owned_projects": {"_id":1, "_id":2},
            "joined_projects": {"_id":5, "_id":7}}

collection.insert_one(post)

get = collection.find({"name":"Hundo"})

for data in get:
    print(data)

update = collection.update_one({"_id":0}, {"$set": {"name": "not_a_person"}})

for data in update:
    print(data)