// AuctionTeamRepository.js

const AuctionTeam = require('../models/AuctionTeam');

class AuctionTeamRepository {
  async create(auctionTeam) {
    return await AuctionTeam.create(auctionTeam);
  }

  async getAll() {
    return await AuctionTeam.findAll();
  }

  async getByName(team_name) {
    return await AuctionTeam.findOne({ where: { team_name } });
  }

  async update(team_name, auctionTeam) {
    return await AuctionTeam.update(auctionTeam, { where: { team_name } });
  }

  async delete(team_name) {
    return await AuctionTeam.destroy({ where: { team_name } });
  }
}

module.exports = new AuctionTeamRepository();
