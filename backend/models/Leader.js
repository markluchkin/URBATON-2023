const mongoose = require("mongoose");

const leaderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Leader",
    required: true,
  }
});

const Leader = mongoose.model("Leader", leaderSchema);

module.exports = Leader;