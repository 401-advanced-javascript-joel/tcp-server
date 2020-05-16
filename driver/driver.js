'use strict';

const io = require('socket.io-client');
const faker = require('faker');

const socket = io.connect('http://localhost:3000/csps');

socket.on('connect', () => {
  socket.emit('join', { room: 'The Driver Room' });
  console.log('Connected to TCP Socket Server!');
});

socket.on('pickup', (payload) => {
  setTimeout(() => {
    console.log(`DRIVER: Picked up order ${payload.orderID}.`);
    socket.emit('in-transit', payload);
  }, 1000);
});

socket.on('in-transit', (payload) => {
  setTimeout(() => {
    console.log(`DRIVER: Delivered order ${payload.orderID}`);
    socket.emit('delivered', payload);
  }, 3000);
});

socket.on('disconnect', () => {
  console.log('Disconnected from TCP Socket Server!');
});
