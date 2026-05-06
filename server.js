const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

// 🔥 THIS IS THE PART YOU MODIFY
app.post("/lead", async (req, res) => {
  const { name, phone, service } = req.body;

  console.log("New Lead:", name, phone, service);

  // Send data to Google Sheets
  await fetch("https://script.google.com/macros/s/AKfycbx7Ms_CFKTCiv7DzukjVKN38zVXgMTAhUn2tbXghRvpW5JY0-fwQ4XTcw40BwrKbVhH7Q/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      phone,
      service
    })
  });

  res.json({ status: "saved" });
});

app.get("/", (req, res) => {
  res.send("Laundry Bot API Running");
});

app.listen(3000, () => console.log("Server running on port 3000"));
