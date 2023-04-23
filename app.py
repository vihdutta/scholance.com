from flask import (Flask, render_template, request, flash,
                   redirect, url_for)
from pymongo import MongoClient
import sib_api_v3_sdk
import certifi

# Mongo DB Setup
cluster = MongoClient("mongodb+srv://scholance:3kxzhyifLA5kVeDk@cluster0.ovv1ops.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=certifi.where())
db = cluster["main"]
users_db = db["users"]
projects_db = db["projects"]

# SendInBlue Setup
sib_configuration = sib_api_v3_sdk.Configuration()
sib_configuration.api_key['api-key'] = "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"
sib_api_transactional_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(sib_configuration))
sib_api_contacts_instance = sib_api_v3_sdk.ContactsApi(sib_api_v3_sdk.ApiClient(sib_configuration))
sib_api_lists_instance = sib_api_v3_sdk.FilesApi(sib_api_v3_sdk.ApiClient(sib_configuration))
# Flask Setup
app = Flask(__name__)
app.secret_key = "SECRET"

# General Definitions
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}


@app.route('/', methods=["GET", "POST"])
def index():        
    if request.method == "POST":
        send_contact_email()
    return render_template("/index.html")

@app.route('/organizations', methods=["GET", "POST"])
def organizations():
    if request.method == "POST":
        send_contact_email()
    return render_template("/organizations.html")


@app.route('/about', methods=["GET", "POST"])
def about():
    return render_template("/about.html")

def send_contact_email():
    question_email = request.form.get('question-email')
    # if they're in HCPS list add to normal
    if try_change_hcps_to_standard(question_email):
        return redirect(request.url)
    
    try:
        first_name = request.form.get('name').split(" ")[0]
        last_name = request.form.get('name').split(" ")[1]
    except Exception:
        first_name = request.form.get('name')
        last_name = ""
    message = request.form.get('message')

    create_contact = sib_api_v3_sdk.CreateContact(email=question_email, list_ids=[2], update_enabled=True, attributes={'FIRSTNAME': first_name, 'LASTNAME': last_name})

    template_id = 2
    sender = {"name": "Scholance", "email": "info@scholance.com"}
    to = [{"email": question_email, "name": first_name + last_name}]
    params = {'FIRSTNAME': first_name, 'LASTNAME': last_name, "EMAIL": question_email}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, template_id=template_id, sender=sender, headers=headers, params=params)

    response = sib_api_contacts_instance.create_contact(create_contact)
    print(response)
    sib_api_transactional_instance.send_transac_email(send_smtp_email)
    flash("Thank you for submitting! We'll respond shortly.", "info")
    return redirect(request.url)
    
def try_change_hcps_to_standard(email):
    try:
        response = sib_api_contacts_instance.get_contact_info(email)
        if response.list_ids[0] == 3:
            # add to general list
            contact_emails = sib_api_v3_sdk.AddContactToList()
            contact_emails.emails = [email]
            sib_api_contacts_instance.add_contact_to_list(2, contact_emails)

            # remove from HCPS list
            remove_email = sib_api_v3_sdk.RemoveContactFromList()
            remove_email.emails = [email]
            sib_api_contacts_instance.remove_contact_from_list(3, remove_email)

            flash("HCPS boi.", "info")
            return True
    except Exception:
        return False

@app.route('/api/request-early-access/<email>', methods=["GET"])
def request_early_access(email):
    if try_change_hcps_to_standard(email):
        return redirect(request.url)

    create_contact = sib_api_v3_sdk.CreateContact(email=email, list_ids=[2], update_enabled=True)

    template_id = 3
    sender = {"name": "Scholance", "email": "info@scholance.com"}
    to = [{"email": email, "name": "New Scholancer"}]
    params = {"EMAIL": email}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, template_id=template_id, sender=sender, headers=headers, params=params)

    repsonse = sib_api_contacts_instance.create_contact(create_contact)
    print(repsonse)
    sib_api_transactional_instance.send_transac_email(send_smtp_email)
    return "REQUEST SUCCESSFUL"



if __name__ == '__main__':
    app.run(debug=False, port=6969) #debug=True, port=6969
