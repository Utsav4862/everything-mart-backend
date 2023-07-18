const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  qnt: Number,
  unit_price: Number,
});

module.exports = mongoose.model("Item", itemSchema);
