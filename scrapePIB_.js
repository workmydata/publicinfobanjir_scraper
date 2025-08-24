// Allow older TLS and disable certificate rejection (only for public data)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import tls from "tls";
tls.DEFAULT_MIN_VERSION = "TLSv1";

import fs from "fs";
import path from "path";
import axios from "axios";
import express from "express";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PIB JSON URL
const PIB_URL = "https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/currentalert.json";

// File path to save JSON
const filePath = path.join(__dirname, "pibdata.json"); // keep in repo root

// Function to scrape PIB data
async function scrapeData() {
  try {
    const response = await axios.get(PIB_URL);
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
    console.log(`✅ Data updated at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("❌ Error fetching PIB data:", error.message);
  }
}

// Run once (GitHub Actions only needs this)
scrapeData();

// (Optional: for local testing only)
// Run every 15 minutes
// setInterval(scrapeData, 15 * 60 * 1000);

// (Optional: for local testing only)
// Serve the pibdata.json file
// app.get("/pibdata.json", (req, res) => {
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: "Error reading PIB data" });
//     }
//     res.setHeader("Content-Type", "application/json");
//     res.send(data);
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
// });
