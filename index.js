import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// Google Apps Script URL
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

// Slot spin endpoint
app.get("/spin", async (req, res) => {
  const username = req.query.username;

  const emotes = ["lepBAG", "lepGAMBA", "lepLOVE"];
  let slots;
  let isJackpot = false;

  // Pure random slot spin
  slots = [
    emotes[Math.floor(Math.random() * emotes.length)],
    emotes[Math.floor(Math.random() * emotes.length)],
    emotes[Math.floor(Math.random() * emotes.length)]
  ];

  // Jackpot happens only if all three match
  isJackpot = slots[0] === slots[1] && slots[1] === slots[2];

  const slotDisplay = slots.join(" | ");

  if (isJackpot && username) {
    try {
      await fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
    } catch (error) {
      console.error("Error logging jackpot to Google Sheets:", error);
    }

    const rewards = [
      "a golf trip! lepGOLF",
      "bananas! lepPOG lepBANANA",
      "cheese! lepCHEESY lepCHEESE",
      "some griddies! lepGRIDDY lepGRIDDY lepGRIDDY",
      "pizza! lepPIZZA",
      "sausage! lepSAUSAGE",
      "beer! lepFBEERS",
      "a personal chef! lepCHEF",
      "a pet chicken! lepC",
      "a flight on lepAir lepFLY",
      "a new fridge! lepFRIDGE",
      "1 billion dollars! lepBURNMONEY",
      "priceless art! lepYEPBYLEP",
      "a new washing machine! lepSTUCK",
      "an invisibility cloak! lepSTEALTH"
    ];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    return res.send(`${username} spins... ${slotDisplay} - JACKPOT! lepH You have won ${reward}`);
  }

  return res.send(`${username} spins... ${slotDisplay} - Try again! lepPOINT`);
});

// New route to handle !slotswin lookup
app.get("/check", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).send("Missing username");
  }

  const checkUrl = `${googleScriptUrl}?username=${encodeURIComponent(username)}`;

  try {
    const response = await fetch(checkUrl);
    const text = await response.text();
    return res.send(text);
  } catch (error) {
    console.error("Error fetching from Google Script:", error);
    return res.status(500).send("Error connecting to Google Script");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
