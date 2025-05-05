const express = require("express");
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

app.get("/", (req, res) => {
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  res.send(reward);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
