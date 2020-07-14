const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-email");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  cart: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
