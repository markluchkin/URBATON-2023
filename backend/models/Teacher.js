const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
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
  },
  timetable: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  groups: [
    {
      type: String
    },
  ],
  organization: {
    type: String,
    required: true,
  }
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;