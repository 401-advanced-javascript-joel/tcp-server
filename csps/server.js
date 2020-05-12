'use strict';

const net = require('net');
const server = net.createServer();

// Create a pool of connected sockets
const socketPool = [];
const port = process.env.SERVER_PORT || 3000;

server.on('error', (err) => {
  // Handle errors here.
  console.error(err);
});

server.on('connection', (socket) => {
  // Add socket too pool
  socketPool.push(socket);
  console.log('New Connection:', socket.address());

  // Read incoming data & broadcast it to everyone
  socket.on('data', (payload) => {
    let string = Buffer.from(payload).toString();
    let parsed = {};

    try {
      parsed = JSON.parse(string);
    } catch (e) {
      parsed = {};
    }

    if (parsed.event && parsed.payload) {
      switch (parsed.event) {
        case 'pickup':
          console.log(`EVENT: pickup
  - Time: ${parsed.payload.time}
  - Store: ${parsed.payload.store}
  - OrderID: ${parsed.payload.orderID}
  - Customer: ${parsed.payload.customer}
  - Address: ${parsed.payload.address}`);
          socketPool.forEach((socket) => {
            socket.write(payload);
          });
          break;
        case 'in-transit':
          console.log(`EVENT: in-transit order ${parsed.payload.orderID}`);
          socketPool.forEach((socket) => {
            socket.write(payload);
          });
          break;
        case 'delivered':
          console.log(`EVENT: delivered order ${parsed.payload.orderID}`);
          socketPool.forEach((socket) => {
            socket.write(payload);
          });
          break;
        default:
        // Do nothing
      }
    }
  });
});

// Grab an arbitrary unused port.
server.listen(port, () => {
  console.log('Server up and listening on ', port);
});
