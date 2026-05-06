const express = require("express");
const app = express();

app.use(express.json());

app.post("/lead", async (req, res) => {
  const { name, phone, service } = req.body;

  console.log("New Lead:", name, phone, service);

  await fetch("https://script.google.com/macros/s/AKfycbx7Ms_CFKTCiv7DzukjVKN38zVXgMTAhUn2tbXghRvpW5JY0-fwQ4XTcw40BwrKbVhH7Q/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, phone, service })
  });

  res.json({ status: "saved" });
});

app.listen(3000, () => console.log("Server running"));
