// FIXED VERSION for PIB scraper

import fs from "fs";
import path from "path";
import axios from "axios";
import https from "https";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PIB JSON URL
const PIB_URL =
  "https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/currentalert.json";

// File path to save JSON
const filePath = path.join(__dirname, "pibdata.json"); // keep in repo root

// Create HTTPS agent that allows legacy renegotiation
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // ⚠ disables SSL verification (ok for public data only)
  secureOptions: require("constants").SSL_OP_LEGACY_SERVER_CONNECT, // allow legacy TLS renegotiation
});

// Function to scrape PIB data
async function scrapeData() {
  try {
    const response = await axios.get(PIB_URL, { httpsAgent });
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
    console.log(`✅ Data updated at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("❌ Error fetching PIB data:", error.message);
  }
}

// Run once (for GitHub Actions)
scrapeData();
