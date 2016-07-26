// Invoke the blink command on the device.  Use the Run button below to call the function.  Provide the device id
// of the device you wish to call as input.

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var connectionString = process.env.AzureIoTHubConnectionString;

module.exports = function (context, input) {
    var client = Client.fromConnectionString(connectionString);
    var targetDevice = input;
    var message = new Message('blink');
    message.ack = 'full';
    message.messageId = "SomeMessageId";
    
    client.open(function (err) {
        client.getFeedbackReceiver(receiveFeedback);
        if (err) {
          context.error('Could not connect: ' + err.message);
        } else {
            context.log(input);
            context.log(message);
            client.send(input, message, function(err){
                context.log('ERROR: ' + err);
            });
        }
    });
    // Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      context.log(op + ' error: ' + err.toString());
    } else {
      context.log(op + ' status: ' + res.constructor.name);
    }
  };
}

function receiveFeedback(err, receiver){
  receiver.on('message', function (msg) {
    context.log('Feedback message:')
    context.log(msg.getData().toString('utf-8'));
  });
}
    context.done();
    
}



