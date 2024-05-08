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

// Create server instance
const server = http.createServer(app);

// Create socket using the instance
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:5000"],
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

    // Get the productivity score of the employee who made the bid
    const employee = await EmployeeRepository.getById(data.sap_id);
    const productivityScore = employee ? employee.productivity_score : null;
    console.log('Productivity score:', productivityScore);

    // Add the productivity score to the bid data
    data.productivity_score = productivityScore;

    // Broadcast the bid data to all other clients
    socket.broadcast.emit('bid', data);
  });



  socket.on('endBid', () => {
    acceptBids = false; // Stop accepting new bids
    console.log('Bid ended');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
