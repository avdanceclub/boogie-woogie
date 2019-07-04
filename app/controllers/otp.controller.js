var requestPromise = require('request-promise');
const Contestant = require('../models/contestant.model.js');
const GroupAVote = require('../models/groupavote.model.js');
const GroupBVote = require('../models/groupbvote.model.js');
const dataprotect = require('../utils/dataprotect');



// Send OTP
exports.send = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Request can not be empty"
        });
    }
    
        return checkDuplicateVoter(dataprotect.encrypt(req.body.phoneNumber), req.body.group).then(data => {
            if (data) {
                return res.status(200).send({
                    Status: "You have already voted for contestant in this Group!"
                })
            }
    
            //Proceed to send the OTP
            return sendOTPRequestToProvider(req.body.phoneNumber).then(otpRes => {
                res.status(200).send(otpRes)
            });
        })
};

//Verify OTP
exports.verify = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Request can not be empty"
        });
    }

    return checkDuplicateVoter(dataprotect.encrypt(req.body.phoneNumber),req.body.group).then(data => {
        if (data && process.env.NODE_ENV !='development') {
           return res.status(200).send({
                Status: "Your vote is already registered!"
            })
        }
        return verifyOTPFromProvider(req.body)
            .then(verficationRes => {
                let cntnstnt = {
                    $push: {
                        VoterId: dataprotect.encrypt(verficationRes.voterPhone)
                    },
                    $inc: {
                        Votes: 1
                    }
                }
                // Find contestant and update it with the request body
                return Contestant.findByIdAndUpdate(req.body.contestantId, cntnstnt, {
                    new: true
                }).then(conts => {
                    // update the vote 
                    let vote;
                    if(conts.Group === 'A'){
                        vote = new GroupAVote({
                            VoterPhoneNumber: dataprotect.encrypt(verficationRes.voterPhone),
                            ContestantId : req.body.contestantId
                        })
                    } else {
                        vote = new GroupBVote({
                            VoterPhoneNumber: dataprotect.encrypt(verficationRes.voterPhone),
                            ContestantId : req.body.contestantId
                        })
                    }
                    
                    return vote.save().then((data) => {
                        console.log(data)
                        delete verficationRes.phoneNumber;
                        res.status(200).send(verficationRes)
                    })
                })
            }).catch(error => {
                res.status(200).send(error)
            });
    });
};

//Logic for https://2factor.in
const sendOTPRequestToProvider = (phoneNumber) => {
    var options = {
        method: 'GET',
        uri: `http://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phoneNumber}/AUTOGEN/BGWG`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        json: true
    };

    //Actual API call
    return requestPromise(options).then(otpRes => {
        console.log(otpRes)
        return otpRes
    }).catch(err => {
        res.status(400).send(err)
    })
}


const verifyOTPFromProvider = (verifyBody) => {
    var options = {
        method: 'GET',
        uri: `http://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${verifyBody.sessionId}/${verifyBody.otp}`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        json: true
    };
    return requestPromise(options).then(verifyRes => {
        console.log(verifyRes)
        return Object.assign(verifyRes, {
            voterPhone: verifyBody.phoneNumber
        });
    }).catch(err => {
        return Promise.reject(err.error)
    })
}

const checkDuplicateVoter = (phoneNumber, group) => {
    if(group === 'A'){
        return GroupAVote.findOne({
            VoterPhoneNumber: phoneNumber
        });
    } else {
        return GroupBVote.findOne({
            VoterPhoneNumber: phoneNumber
        })
    }
}