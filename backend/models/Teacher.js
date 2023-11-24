const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
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
    default: "Teacher",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;