from openpyxl import load_workbook
import requests
import time

apiURL = "http://localhost:3000/api/admin/group-activity"

wb = load_workbook(filename='sheet.xlsx', read_only=True)
ws = wb['MySheet']

counter = 1

for row in ws.rows:
    if counter > 0:
        counter -= 1
        continue
    email = row[9].value
    if email == None or email == "" or len(email) < 4:
        continue
    body = {}
    body["name"] = row[1].value
    body["receiver"] = email
    resp = requests.post(apiURL, json=body)
    time.sleep(3)
