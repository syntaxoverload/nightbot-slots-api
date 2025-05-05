import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// Google Apps Script URL to log and fetch slot jackpot wins
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

// Root endpoint: handles spinning and logs jackpot wins if a username is provided
app.get("/", async (req, res) => {
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
  const jackpot = a === b && b === c;

  if (jackpot) {
    const username = req.query.username || null;

    if (username) {
      try {
        await fetch(googleScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
      } catch (error) {
        console.error("Failed to log jackpot win:", error);
      }
    }

    const jackpotReward = rewards[Math.floor(Math.random() * rewards.length)];
    return res.send(`${rewardString} - JACKPOT! lepH You have won ${jackpotReward}`);
  } else {
    return res.send(`${rewardString} - Try again! lepPOINT`);
  }
});

// Endpoint to check how many times a user has won
app.get("/check", async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send("Missing username");
  }

  try {
    console.log(`Checking wins for username: ${username}`);

    const response = await fetch(`${googleScriptUrl}?username=${username}`);
    const data = await response.text();

    console.log(`Google Sheets response: ${data}`);

    if (data.includes("has")) {
      res.type("text").send(data);
    } else {
      res.type("text").send(`${username} has never won a jackpot! lepHANDS`);
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
