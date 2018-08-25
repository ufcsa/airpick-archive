from openpyxl import load_workbook
import requests

apiURL = "http://localhost:3000/api/admin/orientation/email"

wb = load_workbook(filename='orientationList.xlsx', read_only=True)
ws = wb['Sheet1']

first = True

for row in ws.rows:
    if first:
        first = False
        continue
    body = {}
    body["name"] = row[2].value
    body["table"] = row[7].value
    body["receiver"] = row[3].value
    resp = requests.post(apiURL, json=body)
