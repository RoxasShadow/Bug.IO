var io = require('socket.io'),
    cookie = require('cookie'),
    nohm = require('nohm').Nohm,
    MessageModel = require('../model/message'),
    redis = require('redis'),
    client = redis.createClient();

exports.initialize = function(server) {
  io = io.listen(server);
  var registeredUsers = ['Rox', 'Adam', 'Karan'];
  
  io.sockets.on('connection', function(socket) {
    nohm.setPrefix('bugree:io');
    nohm.setClient(client);

    console.log('Socket ' + socket.id + ' connected.');

    var cookies = cookie.parse(socket.handshake.headers.cookie);
    var sessid = cookies['_bugio_session'];

    socket.on('message', function(message) { // receive and save a message
      if(!socket.userid)
        return socket.send(false, message, 'Login required.');

      message.sender = socket.userid;
      
      var msg = nohm.factory('Message');
      msg.p(message);
      msg.save(function(err) {
        if(err == 'invalid')
          socket.emit('validation_failed', msg.errors);
        else if(err)
          socket.emit('validation_failed', err);
        else {
          var deliveries = message.recipients.concat(message.ccs || []);
          for(delivery in deliveries) // alert every recipient about the new message
            socket.broadcast.to('inbox/' + deliveries[delivery]).emit('new_message', message);
          socket.send(true, message); // inform myself about the new message
        }
      });
    });

    socket.on('login', function(data) { // perform the login
      if(!~registeredUsers.indexOf(data.userid))
        return socket.emit('login', false); // error performing the login

      socket.userid = data.userid;
      socket.join('inbox/' + data.userid); // every user has a his own room
      socket.emit('login', true);
    });

    socket.on('disconnect', function(details) {
      console.log('Socket ' + socket.id + ' disconnected: ' + details + '.');
    });
  });
};
