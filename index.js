import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// Google Apps Script URL to log jackpot wins
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

// Slot emotes
const emotes = ["lepBAG", "lepGAMBA", "lepLOVE"];

// Jackpot rewards
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

// Control jackpot probability (0.0 = never, 1.0 = always)
const jackpotProbability = 1.0;

app.get("/spin", async (req, res) => {
  const username = req.query.username || "Someone";

  let slot1, slot2, slot3;
  let isJackpot = Math.random() < jackpotProbability;

  if (isJackpot) {
    const match = emotes[Math.floor(Math.random() * emotes.length)];
    slot1 = slot2 = slot3 = match;
  } else {
    slot1 = emotes[Math.floor(Math.random() * emotes.length)];
    slot2 = emotes[Math.floor(Math.random() * emotes.length)];
    slot3 = emotes[Math.floor(Math.random() * emotes.length)];
    isJackpot = (slot1 === slot2 && slot2 === slot3); // double-check if it's accidentally a jackpot
  }

  const spinResult = `${slot1} | ${slot2} | ${slot3}`;

  if (isJackpot) {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    // Log to Google Sheet
    try {
      await fetch(`${googleScriptUrl}?username=${username}&reward=${encodeURIComponent(reward)}`);
    } catch (error) {
      console.error("Error logging jackpot:", error);
    }

    res.send(`${username} spins... ${spinResult} - JACKPOT! lepH You have won ${reward}`);
  } else {
    res.send(`${username} spins... ${spinResult} - Try again! lepPOINT`);
  }
});

app.get("/check", async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send("Missing username");
  }

  try {
    const response = await fetch(`${googleScriptUrl}?username=${username}`);
    const data = await response.text();
    if (data.includes("has won the jackpot")) {
      res.type("text").send(data);
    } else {
      res.type("text").send(`${username} has never won a jackpot! lepHANDS`);
    }
  } catch (error) {
    console.error("Error fetching jackpot record:", error);
    res.status(500).send("Error checking jackpot record.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
