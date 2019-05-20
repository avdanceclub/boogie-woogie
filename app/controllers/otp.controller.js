var requestPromise = require('request-promise');
const Contestant = require('../models/contestant.model.js');
const Vote = require('../models/vote.model.js');
const dataprotect = require('../utils/dataprotect');



// Send OTP
exports.send = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Request can not be empty"
        });
    }

    return checkDuplicateVoter(dataprotect.encrypt(req.body.phoneNumber)).then(data => {
        //During developement just asume there are no duplicates and stub the response
        if(process.env.NODE_ENV=='development'){
            return res.send({
                "Status": "Success",
                "Details": "6ec30d77-3f1e-4789-b855-9a3872563969"
            })
        }

        if (data) {
            return res.status(200).send({
                Status: "You have already voted!"
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

    return checkDuplicateVoter(dataprotect.encrypt(req.body.phoneNumber)).then(data => {
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
                    let vote = new Vote({
                        VoterPhoneNumber: dataprotect.encrypt(verficationRes.voterPhone)
                    })
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
        uri: `http://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phoneNumber}/AUTOGEN/AVDANC`,
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

const checkDuplicateVoter = (phoneNumber) => {
    return Vote.findOne({
        VoterPhoneNumber: phoneNumber
    })
}



// return Contestant.findById(req.body.contestantId).then(contestant => {
//     if (contestant && contestant.VoterId.includes(dataprotect.encrypt(req.body.phoneNumber))) {
//         res.status(200).send({
//             Status: "You have alredy voted for this Contestant"
//         })
//     }
//     return sendOTPRequestToProvider(req.body.phoneNumber).then(otpRes => {
//         res.status(200).send(otpRes)
//     });
// })



// // Temperory Stub Remove in prod - response of send otp from 2 factor
// return Promise.resolve({
//     "Status": "Success",
//     "Details": "d4d26cb3-b204-4a50-af6b-a6e937ca0f05"
// });