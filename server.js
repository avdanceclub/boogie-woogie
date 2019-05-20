const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const env = require('dotenv').config()


// create express app
const app = express();

app.use(express.static(path.join(__dirname, './public')));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
// const dbConfig = require('./config/config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(process.env.DB_HOST, {
	// useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

require('./app/routes/note.routes.js')(app);
require('./app/routes/contestant.routes.js')(app);
require('./app/routes/otp.routes.js')(app);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

// listen for requests
app.listen(port, () => {
    console.log("Server is listening on port 3000");
});