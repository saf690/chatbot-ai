const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Laundry Bot API Running");
});

app.post("/lead", async (req, res) => {
  console.log("🔥 /lead HIT");
  console.log("BODY RECEIVED:", req.body);

  try {
    const { name, phone, location, service } = req.body;

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbx7Ms_CFKTCiv7DzukjVKN38zVXgMTAhUn2tbXghRvpW5JY0-fwQ4XTcw40BwrKbVhH7Q/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone, location, service })
    });

    if (!response.ok) {
      throw new Error(`Google Script failed: ${response.status}`);
    }

    const text = await response.text();
    console.log("✅ Google Script Response:", text);

    res.json({ success: true, message: "Lead saved" });

  } catch (err) {
    console.log("❌ SERVER ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
