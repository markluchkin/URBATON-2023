const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    },
    organization: {
        type: String,
        required: true,
    }
})
const Mark = mongoose.model("Mark", markSchema);
module.exports = Mark;