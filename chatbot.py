from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ---------------------------
# CREATE CSV FILE
# ---------------------------
if not os.path.exists("leads.csv"):
    with open("leads.csv", "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["DateTime", "Name", "Phone", "Location", "Intent"])

# ---------------------------
# SAVE LEAD API
# ---------------------------
@app.route("/chat", methods=["POST"])
def save_lead():
    data = request.json

    print("🔥 DATA RECEIVED:", data)  # DEBUG

    name = data.get("name")
    phone = data.get("phone")
    location = data.get("location")
    intent = data.get("intent")

    with open("leads.csv", "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            name,
            phone,
            location,
            intent
        ])

    print("✅ New Lead Saved:", name, phone)

    return jsonify({"status": "success"})

# ---------------------------
# HEALTH CHECK (IMPORTANT FOR RENDER)
# ---------------------------
@app.route("/")
def home():
    return "Backend is running"

# ---------------------------
# RUN SERVER
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
