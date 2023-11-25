const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
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
    default: "Admin",
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  organization: {
    type: String,
    required: true,
  }
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;