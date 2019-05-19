module.exports = (app) => {
    const otp = require('../controllers/otp.controller.js');

    // Send a OTP
    app.post('/otp/send', otp.send);

    // Verfy OTP
    app.post('/otp/verify', otp.verify);
}