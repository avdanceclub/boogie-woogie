const Contestant = require('../models/contestant.model.js');
const Votes = require('../models/vote.model.js');
const dataProtect = require('../utils/dataprotect.js')
const protectedFields = ['PhoneNumber', 'Email', 'VoterPhoneNumber'];
const requestPromise = require('request-promise');

// Create and Save a new Contestant
exports.create = (req, res) => {
    // Validate request
    if (!req.body.ID) {
        return res.status(400).send({
            message: "Contestant content can not be empty"
        });
    }

    // Create a Contestant
    const contestant = new Contestant(encryptFields(req.body));

    // Save Contestant in the database
    contestant.save()
        .then(data => {
            res.send(decryptFields(data));
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Contestant."
            });
        });
};

// Retrieve and return all contestants from the database.
exports.findAll = (req, res) => {
    Contestant.find()
        .then(contestants => {
            contestants.map(item => decryptFields(item))
            res.send(contestants);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving contestants."
            });
        });
};

// Find a single contestant with a contestantId
exports.findOne = (req, res) => {
    Contestant.findById(req.params.contestantId)
        .then(contestant => {
            if (!contestant) {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            res.send(decryptFields(contestant));
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            return res.status(500).send({
                message: "Error retrieving contestant with id " + req.params.contestantId
            });
        });
};

// Update a contestant identified by the contestantId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body && !req.params.contestantId) {
        return res.status(400).send({
            message: "Contestant content can not be empty"
        });
    }

    // Find contestant and update it with the request body
    Contestant.findByIdAndUpdate(req.params.contestantId, encryptFields(req.body), {
            new: true
        })
        .then(contestant => {
            if (!contestant) {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            res.send(decryptFields(contestant));
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            return res.status(500).send({
                message: "Error updating contestant with id " + req.params.contestantId
            });
        });
};


// Update vote contestant identified by the contestantId in the request
exports.updateVote = (req, res) => {
    // Validate Request
    if (!req.body && !req.params.contestantId) {
        return res.status(400).send({
            message: "Contestant content can not be empty"
        });
    }

    let cntnstnt = Object.assign(req.body, {
        $inc: {
            Votes: 1
        }
    })

    // Find contestant and update it with the request body
    Contestant.findByIdAndUpdate(req.params.contestantId, cntnstnt, {
            new: true
        })
        .then(contestant => {
            if (!contestant) {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            res.send(contestant);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            return res.status(500).send({
                message: "Error updating contestant with id " + req.params.contestantId
            });
        });
};



// Delete a contestant with the specified contestantId in the request
exports.delete = (req, res) => {
    Contestant.findByIdAndRemove(req.params.contestantId)
        .then(contestant => {
            if (!contestant) {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            res.send({
                message: "Contestant deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Contestant not found with id " + req.params.contestantId
                });
            }
            return res.status(500).send({
                message: "Could not delete contestant with id " + req.params.contestantId
            });
        });
};

exports.getallvotes = (req, res) => {
    Votes.find()
        .then(votes => {
            votes.map(item => decryptFields(item))
            res.send(votes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving votes."
            });
        });
};

//  Handles Protected Data

const encryptFields = (dataObj) => {
    for (let prop in dataObj) {
        if (protectedFields.includes(prop)) {
            dataObj[prop] = dataProtect.encrypt(dataObj[prop])
        }
    }
    return dataObj
}

const decryptFields = (dataObj) => {
    for (let prop in dataObj) {
        if (protectedFields.includes(prop)) {
            dataObj[prop] = dataProtect.decrypt(dataObj[prop])
        }
    }
    return dataObj
}

exports.load = (req, res) => {
    var options = {
        method: 'GET',
        uri: `https://www.townscript.com/api/registration/getRegisteredUsers?eventCode=av-boogie-woogie-222112`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': process.env.TOWNSCRIPT_API_KEY
        },
        json: true
    };

    return requestPromise(options).then(contestatntData => {
        console.log(contestatntData)

        let constestantPromise = JSON.parse(contestatntData.data).map((item) => {
            const contestant = new Contestant(encryptFields({
                "ID": item.registrationId,
                "Name": item.userName,
                "PartnerName": item.customAnswer140733,
                "PhoneNumber": item.customQuestion4,
                "Email": item.userEmailId,
                "Group": item.ticketName.includes('Group B') ? "B" : "A",
                "DanceType": item.customAnswer137941
            }));
            return contestant.save()
        })

        return Promise.all(constestantPromise).then(data => {
            res.send(data);
        });
    }).catch(err => {
        throw err;
    })
}

exports.sync = (req, res) => {
    var options = {
        method: 'GET',
        uri: `https://www.townscript.com/api/registration/getRegisteredUsers?eventCode=av-boogie-woogie-222112`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': process.env.TOWNSCRIPT_API_KEY
        },
        json: true
    };

    return requestPromise(options).then(contestatntData => {
        console.log(contestatntData)
        let constestantPromise = JSON.parse(contestatntData.data).map((item) => {
            let query = {
                'ID': item.registrationId
            };
            let data = encryptFields({
                "ID": item.registrationId,
                "Name": item.userName,
                "PartnerName": item.customAnswer140733,
                "PhoneNumber": item.customQuestion4,
                "Email": item.userEmailId,
                "Group": item.ticketName.includes('Group B') ? "B" : "A",
                "DanceType": item.customAnswer137941
            })
            return Contestant.findOneAndUpdate(query, data, {
                upsert: true
            })
        })

        return Promise.all(constestantPromise).then(data => {
            res.send(data);
        });
    }).catch(err => {
        throw err;
    })
}