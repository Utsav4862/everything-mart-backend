const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_id: Number,
  customer_name: String,
  date: String,
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  amount: Number,
});
module.exports = mongoose.model("Order", orderSchema);
