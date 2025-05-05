import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// Google Apps Script URL for logging
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

const rewards = [
  "a golf trip! lepGOLF",
  "bananas! lepPOG lepBANANA",
  "cheese! lepCHEESY lepCHEESE",
  "some griddies! lepGRIDDY lepGRIDDY lepGRIDDY",
  "pizza! lepPIZZA",
  "sausage! lepSAUSAGE",
  "beer! lepFBEERS",
  "a flight on lepAir lepFLY",
  "a new fridge! lepFRIDGE",
  "1 billion dollars! lepBURNMONEY",
  "priceless art! lepYEPBYLEP",
  "priceless art! lepFLIRTBYLEP",
  "a new washing machine! lepSTUCK",
  "an invisibility cloak! lepSTEALTH"
];

app.get("/", async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send("Missing username");
  }

  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  // Log to Google Sheets
  try {
    await fetch(googleScriptUrl, {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Logging to Google Sheets failed:", err);
  }

  // Respond with a single clean reward
  res.type("text").send(reward);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
