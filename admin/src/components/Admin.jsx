import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Import socket.io client

const Admin = () => {
  const [socket, setSocket] = useState(null); // State to store the socket

  // Function to handle end bid button click
  const handleEndBid = () => {
    // Emit end bid event to server
    socket.emit('endBid');
  };

  // Initialize socket when the component mounts
  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Render the admin controls
  return (
    <div>
      <h1>Admin Controls</h1>
      <button onClick={handleEndBid}>End Bid</button>
    </div>
  );
};

export default Admin;
