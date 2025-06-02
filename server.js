require("dotenv").config();
const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.json());

const UPLOADCARE_SECRET_KEY = "b4c69683e25db846bc47";
app.post("/uploadcare-signature", (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000) + 60 * 30; // 30 min validity
  const signatureString = `UPLOADCARE_PUB_KEY=${req.body.pub_key}&expire=${timestamp}`;
  const signature = crypto
    .createHmac("sha256", UPLOADCARE_SECRET_KEY)
    .update(signatureString)
    .digest("hex");
  res.json({
    signature,
    expire: timestamp,
  });
});
app.listen(3000, () => console.log("Signature endpoint running"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
