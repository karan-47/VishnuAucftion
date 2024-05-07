// AuctionTeamController.js

const AuctionTeamRepository = require('../repositories/AuctionTeamRepository');

class AuctionTeamController {
  async create(req, res) {
    const auctionTeam = await AuctionTeamRepository.create(req.body);
    res.status(201).json(auctionTeam);
  }

  async getAll(req, res) {
    const auctionTeams = await AuctionTeamRepository.getAll();
    res.json(auctionTeams);
  }

  async getByName(req, res) {
    const auctionTeam = await AuctionTeamRepository.getByName(req.params.team_name);
    res.json(auctionTeam);
  }

  async update(req, res) {
    await AuctionTeamRepository.update(req.params.team_name, req.body);
    res.status(204).end();
  }

  async delete(req, res) {
    await AuctionTeamRepository.delete(req.params.team_name);
    res.status(204).end();
  }
}

module.exports = new AuctionTeamController();
