from openpyxl import load_workbook
import requests
import time

apiURL = "http://localhost:3000/api/admin/csainterview/email"

wb = load_workbook(filename='interview-sp19.xlsx', read_only=True)
ws = wb['mySheet']

counter = 9

for row in ws.rows:
    if counter > 0:
        counter -= 1
        continue
    email = row[4].value
    if email == None or email == "" or len(email) < 4:
        continue
    body = {}
    body["name"] = row[2].value
    body["time"] = row[6].value
    body["receiver"] = email
    resp = requests.post(apiURL, json=body)
    time.sleep(3)
