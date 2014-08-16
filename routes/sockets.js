var io = require('socket.io'),
    cookie = require('cookie');

exports.initialize = function(server) {
  io = io.listen(server);
  var registeredUsers = ['Rox', 'Adam', 'Karan'];
  
  io.sockets.on('connection', function(socket) {
    console.log('Socket ' + socket.id + ' connected.');

    var cookies = cookie.parse(socket.handshake.headers.cookie);
    var sessid = cookies['_bugio_session'];
    console.log(sessid);

    socket.on('message', function(message) {
      if(!socket.userid)
        return socket.send(false, message, 'Login required.');

      message.sender = socket.userid;
      var deliveries = message.recipients.concat(message.ccs || []);
      for(delivery in deliveries)
        socket.broadcast.to('inbox/' + deliveries[delivery]).emit('new_message', message);
      socket.send(true, message);
    });

    socket.on('login', function(data) {
      if(~registeredUsers.indexOf(data.userid))
        return socket.emit('login', false);

      socket.userid = data.userid;
      socket.join('inbox/' + data.userid);
      socket.emit('login', true);
    });

    socket.on('disconnect', function(details) {
      console.log('Socket ' + socket.id + ' disconnected: ' + details + '.');
    });
  });
};
