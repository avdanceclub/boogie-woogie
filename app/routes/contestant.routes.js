module.exports = (app) => {
    const contestants = require('../controllers/contestant.controller.js');

    // Create a new Contestant
    app.post('/contestants', contestants.create);

    // Retrieve all contestants
    app.get('/contestants', contestants.findAll);

    // Retrieve a single Contestant with contestantId
    app.get('/contestants/:contestantId', contestants.findOne);

    // Update a Contestant with contestantId
    app.put('/contestants/:contestantId', contestants.update);

    // Update a Contestant with contestantId
    app.put('/contestants/:contestantId/vote', contestants.updateVote);

    // Delete a Contestant with contestantId
    app.delete('/contestants/:contestantId', contestants.delete);
    
    //Get all the votes
    app.get('/vote', contestants.getallvotes);

    //Load Townscript data to db
    app.get('/loaddata', contestants.load);
    
    //Load Townscript data to db
    app.get('/sync', contestants.sync);


}