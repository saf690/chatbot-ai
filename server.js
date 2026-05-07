const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Laundry Bot API Running");
});

app.post("/lead", async (req, res) => {
  console.log("🔥 /lead endpoint was hit");

  try {
    const { name, phone, location, service } = req.body;

    console.log("New Lead:", name, phone, location, service);

    // Google Apps Script URL
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbx7Ms_CFKTCiv7DzukjVKN38zVXgMTAhUn2tbXghRvpW5JY0-fwQ4XTcw40BwrKbVhH7Q/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        location,
        service
      })
    });

    const text = await response.text();

    console.log("✅ Google Script Response:", text);

    res.json({
      success: true,
      message: "Lead saved"
    });

  } catch (err) {
    console.log("❌ SERVER ERROR:", err);

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
