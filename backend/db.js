const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://admin:admin123@test.ivw9qsv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;