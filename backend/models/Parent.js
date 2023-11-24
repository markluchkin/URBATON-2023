const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "Parent",
    required: true,
  }
});

const Parent = mongoose.model("Parent", parentSchema);

module.exports = Parent;