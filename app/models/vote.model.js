const mongoose = require('mongoose');

const VoteSchema = mongoose.Schema({
    VoterPhoneNumber : String,
    ContestantId : String
});

module.exports = mongoose.model('Vote', VoteSchema);