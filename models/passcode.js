const mongoose = require('mongoose');

const passcodeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  passcode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Passcode', passcodeSchema);
