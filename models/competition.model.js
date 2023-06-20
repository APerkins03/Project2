const { model } = require("mongoose");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const User = require('../user'); 

const competitionSchema = new Schema({
    teamName: {
      type: String,
      required: true
    },
    headCook: {
      type: String,
      required: true
    },
    fbaNum: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: Number,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });








const Competition = mongoose.model('Competition', competitionSchema);


module.exports = Competition;