const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('shiftbiddb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

class AuctionTeam extends Model {}

AuctionTeam.init({
  team_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  availability_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'AuctionTeam',
  tableName: 'auctionteam',
  timestamps: false
});

// Sync the model with the database
sequelize.sync()
  .then(() => console.log('AuctionTeam table has been successfully created, if one doesn\'t exist'))
  .catch(error => console.log('This error occured', error));

module.exports = AuctionTeam;
