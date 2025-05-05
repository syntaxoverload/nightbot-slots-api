// index.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

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

// Control the chance of hitting jackpot here (e.g., 0.05 = 5%)
const jackpotChance = 0.95;

// Log jackpot to Google Sheets
async function logJackpot(username) {
  try {
    await fetch(googleScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
  } catch (err) {
    console.error("Error logging jackpot win:", err);
  }
}

// Endpoint used by Nightbot only when a jackpot condition is met
app.get("/", async (req, res) => {
  const username = req.query.username || "Someone";

  if (Math.random() < jackpotChance) {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    await logJackpot(username);
    res.send(`${reward}`);
  } else {
    // Send nothing so Nightbot doesn't duplicate output
    res.send("");
  }
});

// For !slotswin command
app.get("/check", async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).send("Missing username");

  try {
    const response = await fetch(`${googleScriptUrl}?username=${username}`);
    const text = await response.text();

    if (text.includes("has won the jackpot")) {
      res.type("text").send(text);
    } else {
      res.type("text").send(`${username} has never won a jackpot! lepHANDS`);
    }
  } catch (err) {
    console.error("Error checking jackpot wins:", err);
    res.status(500).send("Error checking jackpot wins.");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
