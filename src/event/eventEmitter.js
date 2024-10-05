
const EventEmitter = require('events');

// Create a custom class that extends EventEmitter
class MyEmitter extends EventEmitter {}

// Create an instance of your custom event emitter
const myEmitter = new MyEmitter();

myEmitter.on('sendEmailNotification', async (data) => {
    console.log('Event triggered with data:', data);
  //TODO:: handle asynchronous notification sending for payments
  });

module.exports = myEmitter;
