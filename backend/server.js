const express = require('express');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/EmployeeRoutes');
const auctionTeamRoutes = require('./routes/AuctionTeamRoutes');
const cors = require('cors');
const app = express();
const port = 8080;

// Import http and socket.io
const http = require('http');
const socketIo = require('socket.io');
app.use(cors()); 
app.use(bodyParser.json());
app.use('/api', employeeRoutes);
app.use('/teams', auctionTeamRoutes)

let teams = {};
let employeeMap = {};
let bidMap = {};
let finalAssignment = {}

// Create server instance
const server = http.createServer(app);

// Create socket using the instance
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:5000","http://localhost:3001","http://localhost:3002","*","http://localhost:3003"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


// Import EmployeeRepository
const EmployeeRepository = require('./repositories/EmployeeRepository');

let acceptBids = true

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle bid event
  socket.on('bid', async (data) => {
    if (!acceptBids) return; 
    console.log('Bid received:', data);

    let productivityScore;

    // Check if the productivity score is already stored in employeeMap
    if (employeeMap[data.sap_id]) {
      productivityScore = employeeMap[data.sap_id];
    } else {
      // If not, get the productivity score of the employee who made the bid
      const employee = await EmployeeRepository.getById(data.sap_id);
      productivityScore = employee ? employee.productivity_score : null;
      // Store the productivity score in employeeMap for future use
      employeeMap[data.sap_id] = productivityScore;
    }
    console.log('Productivity score:', productivityScore);

    // Add the productivity score to the bid data
    data.productivity_score = productivityScore;

    // If the sap_id has a bid on another team, mark the old bid as invalid
    if (bidMap[data.sap_id]) {
      // Get the team of the old bid
      const oldTeam = bidMap[data.sap_id];
      
      // Remove the old bid from the team
      teams[oldTeam] = teams[oldTeam].filter(bid => bid.sap_id !== data.sap_id);
    }

    // Update the teams data
    if (!teams[data.team]) {
      // Create a new max heap for the team if it doesn't exist
      teams[data.team] = []
    }

    // Add the employee to the team's max heap
    const bid = {sap_id: data.sap_id, productivity_score: productivityScore};
    teams[data.team].push(bid);

    // Update the bidMap with the new bid and mark it as valid
    bidMap[data.sap_id] = data.team;

    // Broadcast the bid data to all other clients
    socket.broadcast.emit('bid', data);
  });





  socket.on('startBid', () => {
    acceptBids = true; // Stop accepting new bids
    console.log('Bid started');
    teams = {};
    employeeMap = {};
    bidMap = {};
    finalAssignment = {}

  });

  socket.on('endBid', () => {
    acceptBids = false; // Stop accepting new bids
  
    // Initialize finalAssignment with same keys as bidMap and empty string as value
    for (let sap_id in bidMap) {
      finalAssignment[sap_id] = '';
    }
  
    // Go through each team
    for (let team in teams) {
      // Find the employee with the max productivity score
      let maxProductivityScore = -Infinity;
      let maxProductivitySapId = null;
  
      for (let i = 0; i < teams[team].length; i++) {
        if (teams[team][i].productivity_score > maxProductivityScore) {
          maxProductivityScore = teams[team][i].productivity_score;
          maxProductivitySapId = teams[team][i].sap_id;
        }
      }
  
      // Update the finalAssignment for the employee with max productivity score to the team name
      if (maxProductivitySapId !== null) {
        finalAssignment[maxProductivitySapId] = team;
      }
    }

    teams = {};
    employeeMap = {};
    bidMap = {};

    // update the database
  
    console.log('Bid ended');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('printTeams', () => {
    console.log(teams);
    socket.emit('getBids', teams);
  });

  socket.on('finalTeams', async () => {
    for (let sap_id in finalAssignment) {
      const team_name = finalAssignment[sap_id];
      await EmployeeRepository.update(sap_id, { team_name });
    }
    console.log(finalAssignment);
    socket.broadcast.emit('finalAssignments', finalAssignment);

  });

});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
