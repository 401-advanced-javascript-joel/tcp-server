'use strict';

const io = require('socket.io')(3000).of('/csps');

io.on('error', (err) => {
  // Handle errors here.
  console.error(err);
});

io.on('connection', (socket) => {
  console.log('New Connection:', socket.id);

  socket.on('join', (payload) => {
    socket.join(`${payload.room}`);
    console.log(`${socket.id} has joined room: "${payload.room}"`);
  });

  socket.on('pickup', (payload) => {
    console.log(`EVENT: pickup
  - Time: ${payload.time}
  - Store: ${payload.store}
  - OrderID: ${payload.orderID}
  - Customer: ${payload.customer}
  - Address: ${payload.address}`);
    io.to('The Driver Room').emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    console.log(`EVENT: in-transit order ${payload.orderID}`);
    io.to('The Driver Room').emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    console.log(`EVENT: delivered order ${payload.orderID}`);
    io.to('The Vendor Room').emit('delivered', payload);
  });
});

io.on('disconnect', () => {
  // Handle errors here.
  console.log('Server Disconnected');
});
