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
    if (parsed.event === 'pickup') {
      setTimeout(() => {
        console.log(`DRIVER: Picked up order ${parsed.payload.orderID}.`);
        socket.write(
          JSON.stringify({ event: 'in-transit', payload: parsed.payload }),
        );
      }, 1000);
    } else if (parsed.event === 'in-transit') {
      setTimeout(() => {
        console.log(`DRIVER: Delivered order ${parsed.payload.orderID}`);
        socket.write(
          JSON.stringify({ event: 'delivered', payload: parsed.payload }),
        );
      }, 3000);
    }
  }
});
