from flask import (Flask, render_template, request,
                   redirect, session, flash, url_for)
from datetime import datetime
from hashlib import sha256
from pymongo import MongoClient
import certifi

cluster = MongoClient("mongodb+srv://civichours:zTudxFA2GtQN8xP7@cluster0.ovv1ops.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=certifi.where())
db = cluster["main"]
users_db = db["users"]
projects_db = db["projects"]

app = Flask(__name__)
app.secret_key = "SECRET"


@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == "POST" :
        search_query = request.form.get('search')
        if search_query:
            return redirect(url_for("search", search_query=search_query))
        else:
            return redirect('/')
        
    return render_template("/index.html")

@app.route("/about")
def about():
    return render_template("/about.html")

@app.route("/organizations")
def organizations():
    return render_template("/organizations.html")

@app.route('/login', methods=["POST", "GET"])
def login():
    if session.get("username"):
        return redirect(url_for("dashboard"))
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if username == "" or password == "":
            flash("Username or password field empty", "error")
            return redirect(request.url)
        user_in_database = users_db.find_one({"username":username})

        if not user_in_database:
            flash("Invalid username or password!", "error")
            return redirect(request.url)
        
        user_password = user_in_database["password"]
            
        if sha256(password.encode('utf-8')).hexdigest() == user_password:
            session["username"] = user_in_database["username"]
            return redirect(url_for("dashboard"))

        flash("Invalid username or password!", "error")
        return redirect(url_for("login"))
    return render_template("/login.html")


@app.route("/projects_check")
def projects_check():
    projects_data = list(projects_db.find())
    return f"Projects: {projects_data}"


@app.route('/dashboard')
def dashboard():
    if not session.get("username"):
        flash("You are not logged in!", "error")
        return redirect(url_for("login"))
    else:
        user_data = users_db.find_one({"username":session["username"]})
        owned_project_ids = user_data["owned_projects"]
        joined_project_ids = user_data["joined_projects"]
        applied_projects_ids = user_data["applied_projects"]

        owned_projects = []
        joined_projects = []
        applied_projects = []

        for _id in owned_project_ids:
            owned_project = projects_db.find_one({"_id": _id})
            if owned_project:
                owned_projects.append(owned_project["name"])
        for _id in joined_project_ids:
            joined_project = projects_db.find_one({"_id": _id})
            if joined_project:
                joined_projects.append(joined_project["name"])
        for _id in applied_projects_ids:
            applied_project = projects_db.find_one({"_id": _id})
            if applied_project:
                applied_projects.append(applied_project["name"])

        return render_template("/dashboard/dashboard.html",
                               owned_projects=owned_projects,
                               joined_projects=joined_projects,
                               applied_projects=applied_projects)


@app.route("/projects/post", methods=["POST", "GET"])
def postjob():
    if not session.get("username"):
        flash("You are not logged in!", "error")
        return redirect(url_for("login"))
    else:
        if request.method == "POST":
            description = request.form.get("description")
            goals = request.form.get("goals")
            time_commitment = request.form.get("time_commitment")
            expectations = request.form.get("expectations")
            tags = request.form.get("tags")
            if tags != None:
                tags = request.form.get("tags").split(",")
                tags = [tag.strip() for tag in tags]
            project_id = projects_db.count_documents({})

            project = {"_id":project_id,
                    "name": request.form.get("project_name"),
                    "owner": session.get("username"),
                    "volunteers": [],
                    "applications": [],
                    "size": request.form.get("size"),
                    "start":datetime.now().strftime("%m%d%Y"),
                    "goals": goals,
                    "time_commitment": time_commitment,
                    "expectations": expectations,
                    "description": description,
                    "tags": tags,
                    "active": True}
            
            user_in_database = users_db.find_one({"username":session.get("username")})
            user_projects_len = len(user_in_database.get("owned_projects"))

            if user_projects_len > 5:
                flash("You already have 5 projects!", "error")
                return redirect(request.url)
            else:
                projects_db.insert_one(project)
                users_db.update_one({"username":session.get("username")}, {"$push": {"owned_projects": project_id}})

            flash("Project posted successfully!", "info")
            return redirect(request.url)
        else:
            return render_template("/projects/post-project.html")

@app.route('/logout')
def logout():
    session.pop("username")
    return redirect(url_for("index"))


@app.route('/signup', methods=["POST", "GET"])
def signup():
    if session.get("username"):
        return redirect(url_for("dashboard"))
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")

        if username == "" or email == "" or password == "":
            flash("Fill out all fields!", "error")
            return redirect(url_for("signup"))

        user_in_database = users_db.find_one({"username":username})
        if user_in_database:
            flash("Username already exists!", "error")
            return redirect(url_for("signup"))

        full_name = request.form.get("full_name")

        if len(full_name.split(" ")) == 2:
            first_name = full_name.split(" ")[0]
            last_name = full_name.split(" ")[1]
        else:
            first_name = full_name
            last_name = ""

        new_user = {"_id":users_db.count_documents({}),
            "admin": False,
            "username": request.form.get("username"),
            "first_name":first_name,
            "last_name":last_name,
            "email": request.form.get("email"),
            "zip": None,
            "password":sha256(request.form.get("password").encode('utf-8')).hexdigest(),
            "phone_number": None,
            "owned_projects": [],
            "joined_projects": [],
            "applied_projects": []}

        users_db.insert_one(new_user)

        flash("Account successfully created!", "info")
        return redirect(url_for("login"))
    return render_template("/signup.html")


@app.route('/profile/user')
def user_profile():
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    username = request.form['username']
    email = request.form['email']
    school = request.form['school']

    # Check if any fields are empty
    update_dict = {}
    if first_name:
        update_dict['first_name'] = first_name
    if last_name:
        update_dict['last_name'] = last_name
    if username:
        update_dict['username'] = username
    if email:
        update_dict['email'] = email
    if school:
        update_dict['school'] = school

    users_db.update_one({'username': session["username"]}, {'$set': update_dict})
    return render_template("/profile/user-profile.html")


@app.route('/profile/business')
def business_profile():
    return render_template("/profile/business-profile.html")


@app.route('/profile/password')
def password():
    return render_template("/profile/password.html")


@app.route("/projects")
def projects():
    data = list(projects_db.find())
    return render_template("/projects/projects.html", data=data, data_length=len(data))


@app.route("/projects/apply/<padded_id>", methods=["GET"])
def apply(padded_id):
    project_id = padded_id.lstrip("0")
    if project_id == "":
        project_id = "0"

    if project_id.isnumeric():
        project = projects_db.find_one({"_id": int(project_id)})
        project_owner = project.get("owner")
        project_volunteers = project.get("volunteers")
        project_applications = project.get("applications")
        print(session["username"])
        print(project_owner)
        print(project_volunteers)
        print(project_applications)
        if session["username"] != project_owner and session["username"] not in project_volunteers and session["username"] not in project_applications:
                users_db.update_one({"username": session["username"]}, {'$push': {"applied_projects": int(project_id)}})
                projects_db.update_one({"_id": int(project_id)}, {'$push': {"applications": session["username"]}})
                print(f"{session['username']} + {project_owner} + {project_volunteers} + {project_applications}")
        else:
            flash(f"{session['username']} + {project_owner} + {project_volunteers} + {project_applications}", "error")
            return redirect(url_for("projects"))
    else:
        flash("Request error. Please try again later.", "error")
        return redirect(url_for("projects"))
    return redirect(url_for("dashboard"))
# @app.route("/projects/<project_id>")
# def project_page(project_id):
#     if project_id.isnumeric() == False:
#         flash("Invalid link!", "error")
#         return redirect(url_for("projects"))

#     data = list(projects_db.find())
#     for project_data in data:
#         if str(project_data["_id"]).zfill(7) == project_id:
#             return render_template("/projects/project-page.html", project_data=project_data)
#     return "<h1>Project Not Found!</h1>"


# @app.route("/projects/<project>/apply", methods=["POST", "GET"])
# def apply_for_project(project):
#     projects = dynamo.scan_projects("project_url")
#     print("Projects:")
#     for i, p in enumerate(projects):
#         p_url = projects[i]["info"]["project_url"]
#         if p_url == project:
#             pn = projects[i]["project_name"]
#             p = dynamo.get_project(pn)
#             print(p)
#             pa = p["info"]['applications']
#             pa.append(user.username)
#             dynamo.update_project(pn, "applications", pa)
#         else:
#             print("p_url != project")
#     return "<h1>Applied</h1>"



if __name__ == '__main__':
    app.run(debug=True, port=6969) #debug=True, port=6969
