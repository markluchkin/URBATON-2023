const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    },
    subject: {
        type: String,
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    date: {
        type: Date,
        //required: true,
    },
    time: {
        type: String,
        //required: true,
    },
    organization: {
        type: String,
        required: true,
    }
});
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;