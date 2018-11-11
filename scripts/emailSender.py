from openpyxl import load_workbook
import requests
import time

apiURL = "http://localhost:3000/api/admin/bestsingertop16"

wb = load_workbook(filename='happy.xlsx', read_only=True)
ws = wb['mySheet']

counter = 3

for row in ws.rows:
    if counter > 0:
        counter -= 1
        continue
    email = row[2].value
    if email == None or email == "" or len(email) < 4:
        continue
    body = {}
    body["name"] = row[1].value
    body["qualified"] = row[0].value
    body["receiver"] = email
    resp = requests.post(apiURL, json=body)
    time.sleep(3)
