import express from "express";
import fetch from "node-fetch";  // Ensure node-fetch is installed

const app = express();
const PORT = process.env.PORT || 5000;

// Google Apps Script URL to fetch slot wins data
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

// Endpoint to handle spins and track wins
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

  const a = Math.floor(Math.random() * rewards.length);
  const b = Math.floor(Math.random() * rewards.length);
  const c = Math.floor(Math.random() * rewards.length);

  const rewardString = `${rewards[a]} | ${rewards[b]} | ${rewards[c]}`;
  const jackpot = a === b && b === c; // Check if the 3 emotes match (jackpot condition)

  if (jackpot) {
    const jackpotReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    // Write to Google Sheets when the user wins
    const username = req.query.username; // You should pass the username as a query parameter
    if (username) {
      fetch(`${googleScriptUrl}?username=${username}`, { method: 'GET' })
        .then((response) => response.text())
        .then((data) => {
          console.log(`Google Sheets response: ${data}`);
        })
        .catch((error) => {
          console.error('Error writing to Google Sheets:', error);
        });
    }

    res.send(`${rewardString} - JACKPOT! lepH You have won ${jackpotReward}`);
  } else {
    res.send(`${rewardString} - Try again! lepPOINT`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
