from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
from datetime import datetime
import os
import requests  # ✅ NEW

app = Flask(__name__)
CORS(app)

# ---------------------------
# CREATE CSV FILE (optional backup)
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
    try:
        data = request.get_json(force=True)

        print("🔥 FULL DATA RECEIVED:", data, flush=True)

        name = data.get("name")
        phone = data.get("phone")
        location = data.get("location")
        intent = data.get("intent")

        # ---------------------------
        # SAVE TO CSV (backup)
        # ---------------------------
        with open("leads.csv", "a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                name,
                phone,
                location,
                intent
            ])

        # ---------------------------
        # SEND TO GOOGLE SHEETS ✅
        # ---------------------------
        try:
            requests.post(
                "https://script.google.com/macros/s/AKfycbw8KM8M8FbcBF7u_mcBR5CBwlFOJT1sDapaarP-en7VOzpwZR5vvSAm9M-LNjHFMDghUg/exec",
                json={
                    "name": name,
                    "phone": phone,
                    "location": location,
                    "intent": intent
                }
            )
            print("📊 Sent to Google Sheets", flush=True)

        except Exception as e:
            print("❌ Google Sheets Error:", str(e), flush=True)

        print("✅ New Lead Saved:", name, phone, flush=True)

        return jsonify({
            "status": "success"
        })

    except Exception as e:
        print("❌ ERROR:", str(e), flush=True)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ---------------------------
# HEALTH CHECK
# ---------------------------
@app.route("/", methods=["GET"])
def home():
    return "Backend is running"

# ---------------------------
# RUN SERVER
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
