require("dotenv").config();
const crypto = require("crypto");
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const UPLOADCARE_SECRET_KEY = "b4c69683e25db846bc47";
const UPLOADCARE_PUB_KEY = "69b27fb42b6f0908baea";

app.post("/uploadcare-signature", (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000) + 60 * 30; // 30 min validity
  const signatureString = `UPLOADCARE_PUB_KEY=${UPLOADCARE_PUB_KEY}&expire=${timestamp}`;
  const signature = crypto
    .createHmac("sha256", UPLOADCARE_SECRET_KEY)
    .update(signatureString)
    .digest("hex");
  res.json({
    signature,
    expire: timestamp,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
