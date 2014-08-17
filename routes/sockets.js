var io = require('socket.io'),
    cookie = require('cookie'),
    nohm = require('nohm').Nohm,
    MessageModel = require('../models/message'),
    redis = require('redis'),
    client = redis.createClient();

exports.initialize = function(server, cookie_id) {
  io = io.listen(server);
  
  io.sockets.on('connection', function(socket) {
    console.log('Socket ' + socket.id + ' connected.');

    nohm.setPrefix('bugio:io:');
    nohm.setClient(client);

    socket.on('message', function(message) { // receive and save a message
      if(!socket.userid)
        return socket.send(false, message, 'Login required.');

      message.sender = socket.userid;
      message.recipients = message.recipients.join('').split('');
      message.ccs = message.ccs.join('').split('');
      
      var msg = nohm.factory('Message');
      msg.p(message);
      msg.save(function(err) {
        if(err == 'invalid')
          socket.emit('validation_failed', msg.errors);
        else if(err)
          socket.emit('validation_failed', err);
        else {
          var deliveries = message.recipients.concat(message.ccs);
          deliveries.forEach(function(delivery) { // alert every recipient about the new message
            if(parseInt(delivery) > 0)
              socket.broadcast.to('user/' + delivery).emit('new_message', message);
          });
          socket.send(true, message); // inform myself about the new message
        }
      });
    });

    socket.on('login', function(data) {
      var cookies = cookie.parse(socket.handshake.headers.cookie);
      var sessid = cookies[cookie_id];
      
      client.get('bugio:session:' + sessid, function(err, value) {
        if(!value)
          return socket.emit('login', false);

        var storedCookie = JSON.parse(value);
        socket.userid = storedCookie['warden.user.user.key'][0][0];
        socket.join('user/' + socket.userid);
        return socket.emit('login', true);
      });
    });

    socket.on('disconnect', function(details) {
      console.log('Socket ' + socket.id + ' disconnected: ' + details + '.');
    });
  });
};
