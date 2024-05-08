import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; 
import styled from 'styled-components';

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const Typography = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Admin = () => {
  const [socket, setSocket] = useState(null); 

  const handleEndBid = () => {
    socket.emit('endBid');
  };

  const handleStartBid = () => {
    socket.emit('startBid');
  };

  const handleDisplayBid = () => {
    socket.emit('printTeams');
  };
  const handleFinalTeams = () => {
    socket.emit('endBid');
    socket.emit('finalTeams');
  };

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <Container>
      <Typography>Admin Controls</Typography>
      <Button onClick={handleEndBid}>End Bid</Button>
      <Button onClick={handleStartBid}>Start Bid</Button>
      <Button onClick={handleDisplayBid}>Display Bids</Button>
      <Button onClick={handleFinalTeams}>Final Teams</Button>
    </Container>
  );
};

export default Admin;
