const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-email");

const OrderSchema = new Schema({
  userID: {
    type: mongoose.SchemaTypes.Email,
    required: false,
  },
  items: {
    type: Array,
    default: [],
    required: true,
  },
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
