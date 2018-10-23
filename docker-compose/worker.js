//worker.js
//const amqp = require('amqplib');

/*process.on("message", (msg) => {
  console.log(msg)
});

process.send({ counter: 1 });
*/

// Wait for connection to become established.
/*connection.on('ready', function () {
  console.log('Connection ready for use. Connecting to "hello" queue...');

  // Use the default 'amq.topic' exchange
  connection.queue('hello', { 
    autoDelete: false 
  }, function(q){
    console.log('Connected to "hello" queue. Waiting for queue to become ready');

    // Catch all messages
    q.bind('#');

    q.on('queueBindOk', function() {

      console.log('The "hello" queue is now ready for use. Subscribing for messages (Ctrl+c to disconnect)...');

      // Receive messages
      q.subscribe(function (message) {
        console.log('Received message... ');

        // Print messages to stdout
        var buf = new Buffer(message.data);
        
        console.log(buf.toString('utf-8'));
      });

    });

  });
});

connection.on('error',function(){
  console.log('Error conectando con el broker');
});
*/

var amqp = require('amqplib/callback_api');

amqp.connect("amqp://admin:admin@192.168.99.100:5672", function(err, conn) {
  
  conn.createChannel(function(err, ch) {
    var q = 'tasks';
    
    ch.assertQueue(q, {durable: true});
    ch.prefetch(5);

    ch.consume(q, function(msg) {
      
      console.log(" [x] Received %s", msg.content.toString());

      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, 1000);
    }, {noAck: false});

  });
});

