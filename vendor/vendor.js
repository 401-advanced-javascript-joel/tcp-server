'use strict';

const net = require('net');

const faker = require('faker');

const socket = net.Socket();

socket.connect({ port: 3000, host: 'localhost' }, () => {
  console.log('Connected to TCP Socket Server!');
});

socket.on('data', (payload) => {
  let string = Buffer.from(payload).toString();
  let parsed = {};

  try {
    parsed = JSON.parse(string);
  } catch (e) {
    parsed = {};
  }

  if (parsed.event && parsed.payload) {
    if (parsed.event === 'delivered')
      console.log(
        `VENDOR: Thank you for delivering order ${parsed.payload.orderID}`,
      );
  }
});

setInterval(() => {
  const order = {
    time: new Date().toLocaleString('en-US'),
    store: "Joel's Jams",
    orderID: faker.random.uuid(),
    customer: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`,
  };
  socket.write(JSON.stringify({ event: 'pickup', payload: order }));
}, 5000);
