'use strict';

const io = require('socket.io-client');
const faker = require('faker');

const socket = io.connect('http://localhost:3000/csps');

socket.on('connect', () => {
  socket.emit('join', { room: 'The Vendor Room' });
  console.log('Connected to TCP Socket Server!');
});

socket.on('delivered', (payload) => {
  console.log(`VENDOR: Thank you for delivering order ${payload.orderID}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from TCP Socket Server!');
});

setInterval(() => {
  const order = {
    time: new Date().toLocaleString('en-US'),
    store: "Joel's Jams",
    orderID: faker.random.uuid(),
    customer: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`,
  };
  socket.emit('pickup', order);
}, 5000);
