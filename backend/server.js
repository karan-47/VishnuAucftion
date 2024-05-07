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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle bid event
  socket.on('bid', (data) => {
    console.log('Bid received:', data);
    socket.broadcast.emit('bid', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
