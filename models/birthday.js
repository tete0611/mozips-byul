const mongoose = require('mongoose');

const birth = new mongoose.Schema({
  date: String,
  userId: String,
});

const Model = (module.exports = mongoose.model('birthday', birth));
