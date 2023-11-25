const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }]
})
const Group = mongoose.model("Group", groupSchema);

module.exports = Group;