const mongoose = require('mongoose');

const GroupAVoteSchema = mongoose.Schema({
    VoterPhoneNumber : String,
    ContestantId : String
});

module.exports = mongoose.model('GroupAVote', GroupAVoteSchema);
