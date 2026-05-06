const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/lead", (req, res) => {
  const { name, phone, service } = req.body;

  console.log("New Lead:", name, phone, service);

  res.json({ status: "success" });
});

app.get("/", (req, res) => {
  res.send("Laundry Bot API Running");
});

app.listen(3000, () => console.log("Server running on port 3000"));
