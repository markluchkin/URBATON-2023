const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  sentTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ]
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
