const express = require('express');
const AuctionTeamController = require('../controllers/AuctionTeamController');
const router = express.Router();

// GET request
router.get('/auctionTeams', AuctionTeamController.getAll);

// GET request for a single auction team
router.get('/auctionTeams/:team_name', AuctionTeamController.getByName);

// POST request
router.post('/auctionTeams', AuctionTeamController.create);

// PUT request
router.put('/auctionTeams/:team_name', AuctionTeamController.update);

// DELETE request
router.delete('/auctionTeams/:team_name', AuctionTeamController.delete);

module.exports = router;
