from openpyxl import load_workbook
import requests
import time

apiURL = "http://localhost:3000/api/admin/csainterview/email"

wb = load_workbook(filename='csa-interview.xlsx', read_only=True)
ws = wb['Sheet1']

first = True

for row in ws.rows:
    if first:
        first = False
        continue
    email = row[2].value
    if email == None or email == "" or len(email) < 4:
        continue
    body = {}
    body["name"] = row[1].value
    body["time"] = row[4].value
    body["receiver"] = email
    resp = requests.post(apiURL, json=body)
    time.sleep(4)
