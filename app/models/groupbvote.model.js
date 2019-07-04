const mongoose = require('mongoose');

const GroupBVoteSchema = mongoose.Schema({
    VoterPhoneNumber : String,
    ContestantId : String
});

module.exports = mongoose.model('GroupBVote', GroupBVoteSchema);