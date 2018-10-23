let axios = require('axios');
//pm2 start ecosystem.yml --env production
//pm2 monit
//https://medium.com/iquii/good-practices-for-high-performance-and-scalable-node-js-applications-part-1-3-bb06b6204197
//https://www.cloudamqp.com/blog/2017-12-29-part1-rabbitmq-best-practice.html
//https://gist.github.com/jarrettmeyer/d841b8629bcd29c5a0ba
//https://github.com/rabbitmq/rabbitmq-tutorials/blob/master/javascript-nodejs/src/worker.js

var process = require('child_process');
var child = process.fork('worker.js');


/*child.on("message", (msg) => {
  console.log(msg)
});

child.send({ counter: 1 });*/

/*axios.post('http://demo8332185.mockable.io/Notify', params)
.then(function(response) {
  console.log(response.data);
})
.catch(function(error) {
  console.log(error);
});*/


// Wait for connection to become established.
/*connection.on('ready', function () {

  log('Connection ready for use. Connecting to "hello" queue...');

	connection.queue('hello', { 
    autoDelete: false 
  }, function(q){
    
    log('Connected to "hello" queue. Waiting for queue to become ready');
    
    // Bind to all messages
    q.bind('#');
    
    q.on('queueBindOk', function() {
     
      log('The "hello" queue is now ready for use. Publishing message...');
   
      let message = {
        ClientId : "1",
        Message: "hola",
        DateTime: new Date().toLocaleString().replace(/\//g, '-'),
        Attempt: 1
      }

      for(var i=0; i<10; i++){
        connection.publish('hello', message);
      }
     
      // Allow 1 second for the message publishing to complete
      setTimeout(function() {
        log('Disconnecting...');
        connection.disconnect();
        log('Disconnected. Exiting...'); 
      }, 1000 * 10);  

 		});
  });

});

connection.on('error', () => {
  log('Error conectando con RabbitMQ', {});
});

*/
const amqp = require('amqplib');

var start = async () => {
  const connection = await amqp.connect("amqp://admin:admin@192.168.99.100:5672");

  const channel = await connection.createChannel();
  await channel.assertQueue('tasks', { durable: true });

  Array(1000)
    .fill()
    .map(async (x, y) => {
      const task = { message: `Task ${y}` };

      await channel.sendToQueue('tasks', Buffer.from(JSON.stringify(task)), {
        contentType: 'application/json',
        persistent: true
      });

    });

  /*setTimeout(() => {
  connection.close();
  }, 1000 * 3);*/

};

start();


