from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
from datetime import datetime
import os
import requests

app = Flask(__name__)
CORS(app)  # IMPORTANT for Botpress

# ---------------------------
# CREATE CSV FILE
# ---------------------------
if not os.path.exists("leads.csv"):
    with open("leads.csv", "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["DateTime", "Name", "Phone", "Location", "Intent"])


# ---------------------------
# AI FUNCTION (OPTIONAL)
# ---------------------------
def get_ai_reply(user_message):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "gemma:2b",
                "prompt": user_message,
                "stream": False
            }
        )
        return response.json()["response"].strip()
    except:
        return "AI not available"


# ---------------------------
# SAVE LEAD API
# ---------------------------
@app.route("/chat", methods=["POST"])
def save_lead():
    data = request.json

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
# RUN SERVER
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)