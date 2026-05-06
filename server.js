const express = require("express");
const app = express();

// ✅ FIX: import fetch properly
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.use(express.json());

app.post("/lead", async (req, res) => {
  try {
    const { name, phone, location, service } = req.body;

    console.log("🔥 HIT /lead endpoint");
    console.log("New Lead:", name, phone, location, service);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbx7Ms_CFKTCiv7DzukjVKN38zVXgMTAhUn2tbXghRvpW5JY0-fwQ4XTcw40BwrKbVhH7Q/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, location, service }),
      }
    );

    const text = await response.text();
    console.log("Google Sheets response:", text);

    res.json({ status: "saved" });
  } catch (err) {
    console.log("❌ ERROR:", err.message);
    res.status(500).json({ error: "Failed to save lead" });
  }
});

app.get("/", (req, res) => {
  res.send("Laundry Bot API Running");
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
