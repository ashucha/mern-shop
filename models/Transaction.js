const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-email");

const TransactionSchema = new Schema({
  chargeID: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.SchemaTypes.Email,
    required: false,
  },
  items: {
    type: Array,
    default: [],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

TransactionSchema.path("amount").get((amount) => {
  return (amount / 100).toFixed(2);
});

const Transaction = mongoose.model("transaction", TransactionSchema);

module.exports = Transaction;
