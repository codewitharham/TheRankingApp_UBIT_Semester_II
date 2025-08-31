const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load JSON data exported from Java
let rawData = fs.readFileSync("data.json");
let dataList = JSON.parse(rawData);

// API endpoint to get data
app.get("/api/data", (req, res) => {
  res.json(dataList);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
