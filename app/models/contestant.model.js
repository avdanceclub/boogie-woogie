const mongoose = require('mongoose');

const ContestantSchema = mongoose.Schema({
  ID: Number,
  Name: String,
  PartnerName: String,
  PhoneNumber: String,
  Email: String,
  Group: String,
  DanceType: String,
  VoterId : [String],
  Votes : {type: Number, default: 0},
  Semifinalist : { type: Boolean, default: false },
  YoutubeLink : String
}, {
    timestamps: true
});

module.exports = mongoose.model('Contestant', ContestantSchema);