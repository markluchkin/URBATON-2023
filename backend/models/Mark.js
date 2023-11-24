const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    }
})
const Mark = mongoose.model("Mark", markSchema);