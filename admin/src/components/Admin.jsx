import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; 
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #007bff;
    color: white;
  }
`;

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
  const [bids, setBids] = useState([]);
  const [bidStatus, setBidStatus] = useState('Started');
  const [finalAssignment, setFinalAssignment] = useState([]);

  const handleEndBid = () => {
    setBidStatus('Ended');
    setFinalAssignment([])
    setBids([])
    socket.emit('endBid');
  };

  const handleStartBid = () => {
    setBidStatus('Started');
    socket.emit('startBid');
  };

  const handleDisplayBid = () => {
    socket.emit('printTeams');
    socket.on('getBids', data => {
      
      let bidsArray = [];
      for (let team in data) {
        for (let bid of data[team]) {
          bidsArray.push({ id: bid.sap_id,team: team  });
        }
      }
      setFinalAssignment([])
      setBids(bidsArray);
      console.log(bids,"Here are the bids");
    });
  };
  const handleFinalTeams = () => {
    socket.emit('endBid');
    socket.emit('finalTeams');
    socket.on('finalAssignments', data => {
      console.log(data);
      setBids([])
      
      let bidsArray = [];
      for (let item in data ){
        bidsArray.push({id:item, team:data[item]})
      }
      setFinalAssignment(bidsArray)
    });

  };

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);
    
    socket.on('finalAssignments', data => {
      console.log(data);
      setBids([])
      
      let bidsArray = [];
      for (let item in data ){
        bidsArray.push({id:item, team:data[item]})
      }
      setFinalAssignment(bidsArray)
    });
    return () => newSocket.close();
  }, []);

  return (
    <Container>
      <Typography>Admin Controls</Typography>
      <Button onClick={handleEndBid}>End Bid</Button>
      <Button onClick={handleStartBid}>Start Bid</Button>
      <Button onClick={handleDisplayBid}>Display Bids</Button>
      <Button onClick={handleFinalTeams}>Final Teams</Button>
      <Typography>Bid Status: {bidStatus}</Typography> {/* Display bid status */}
      {bids.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>SAP ID</th>
              <th>BID</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr key={index}>
                <td>{bid.id}</td>
                <td>{bid.team}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {finalAssignment.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>SAP ID</th>
              <th>FINAL ASSIGNMNET</th>
            </tr>
          </thead>
          <tbody>
            {finalAssignment.map((fin, index) => (
              <tr key={index}>
                <td>{fin.id}</td>
                <td>{fin.team}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Admin;
