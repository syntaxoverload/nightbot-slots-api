const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 5000;

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
  "an invisibility cloak! lepSTEALTH",
  "priceless art! lepFLIRTBYLEP"
];

// Replace this with your deployed Google Apps Script GET endpoint
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

app.get("/", async (req, res) => {
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  const winner = req.query.winner;

  if (winner) {
    // If a username is provided, check their jackpot wins from the Google Sheet
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?username=${winner}`);
      const result = await response.text();
      res.send(result);  // Respond with the result of how many jackpots the user has won
    } catch (error) {
      console.error("Failed to fetch jackpot data:", error);
      res.send("Error fetching jackpot data.");
    }
  } else {
    // If no username, just spin the slot and log the win if jackpot
    const jackpot = Math.random() < 0.1; // Example chance for jackpot
    if (jackpot) {
      // Log the win (you can fetch and POST to your Google Apps Script here)
      res.send(`${reward} - JACKPOT! You have won a prize! lepH`);
    } else {
      res.send(`${reward} - Try again! lepPOINT`);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
