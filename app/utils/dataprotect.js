const crypto = require('crypto');
const config = require('../../config/config.js');




module.exports.encrypt = (data) => {
    var mykey = crypto.createCipher('aes-128-cbc', config.encryptionKey);
    var encryptedData = mykey.update(data, 'utf8', 'hex')
    encryptedData += mykey.final('hex');
    return encryptedData
}

module.exports.decrypt = (data) => {
    var mykey = crypto.createDecipher('aes-128-cbc', config.encryptionKey);
    var decryptedData = mykey.update(data, 'hex', 'utf8')
    decryptedData += mykey.final('utf8');
    return decryptedData;
}