const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  bandname: {
    type: String,
    required: true
  },
  singer: {
    type: String,
    required: true
  },
  licensenumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;