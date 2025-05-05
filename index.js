import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// Google Apps Script URL (should be the POST-capable version)
const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyS7m0yF5NOl52KMajtNDedUJO3a_PEN9IuKJNCBHPE3S3U2S-Qv-aIY-ykKSZPBlIhBA/exec";

// Endpoint to handle slot spins and jackpot logic
app.get("/spin", async (req, res) => {
  const username = req.query.username;
  const jackpotProbability = 0.01; // 1% chance of winning the jackpot

  const emotes = ["lepBAG", "lepGAMBA", "lepLOVE"];
  let slots;
  let isJackpot = false;

  const randomValue = Math.random(); // Log the random value to see how it's behaving
  console.log(`Random value: ${randomValue}`);

  if (randomValue < jackpotProbability) {
    const jackpotEmote = emotes[Math.floor(Math.random() * emotes.length)];
    slots = [jackpotEmote, jackpotEmote, jackpotEmote];
    isJackpot = true;
  } else {
    slots = [
      emotes[Math.floor(Math.random() * emotes.length)],
      emotes[Math.floor(Math.random() * emotes.length)],
      emotes[Math.floor(Math.random() * emotes.length)]
    ];
    isJackpot = slots[0] === slots[1] && slots[1] === slots[2];
  }

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


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
