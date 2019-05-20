const crypto = require('crypto');




module.exports.encrypt = (data) => {
    var mykey = crypto.createCipher('aes-128-cbc', process.env.ENCRYPTION_KEY);
    var encryptedData = mykey.update(data, 'utf8', 'hex')
    encryptedData += mykey.final('hex');
    return encryptedData
}

module.exports.decrypt = (data) => {
    var mykey = crypto.createDecipher('aes-128-cbc', process.env.ENCRYPTION_KEY);
    var decryptedData = mykey.update(data, 'hex', 'utf8')
    decryptedData += mykey.final('utf8');
    return decryptedData;
}