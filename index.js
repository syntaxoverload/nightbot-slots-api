import express from "express";
import fetch from "node-fetch";  // Ensure node-fetch is installed

const app = express();
const PORT = process.env.PORT || 5000;

// Google Apps Script URL to fetch slot wins data
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

app.get("/", (req, res) => {
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

  // Select one random reward from the rewards list
  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  // 5% chance of hitting a jackpot (this can be adjusted)
  const jackpot = Math.random() < 0.90;

  if (jackpot) {
    // Send jackpot message with a single random reward
    res.send(`${req.query.username} spins... ${reward} - JACKPOT! lepH You have won ${reward}`);
  } else {
    // Non-jackpot spin message
    res.send(`${req.query.username} spins... ${reward} - Try again! lepPOINT`);
  }
});

// Endpoint to check jackpot wins for a specific username
app.get("/check", async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send("Missing username");
  }

  try {
    console.log(`Checking wins for username: ${username}`); // Debugging line

    // Make request to Google Apps Script
    const response = await fetch(`${googleScriptUrl}?username=${username}`);
    const data = await response.text();

    console.log(`Google Sheets response: ${data}`); // Debugging line

    // Make sure the response is plain text
    if (data.includes("has won the jackpot")) {
      res.type('text').send(data);  // Ensure response is plain text
    } else {
      res.type('text').send(`${username} has never won a jackpot! lepHANDS`);
    }
  } catch (error) {
    console.error("Error fetching data from Google Apps Script:", error);
    res.status(500).send("Error fetching data from Google Sheets.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
