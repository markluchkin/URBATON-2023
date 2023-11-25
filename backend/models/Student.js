const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
    default: "Student",
    required: true,
  },
  grade: {
    type: String,
  },
  group: {
    type: String
  },
  instrument: {
    type: String,
  },
  marks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mark",
    },
  ],
  timetable: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  parents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },
  ],
  organization: {
    type: String,
    required: true,
}
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
