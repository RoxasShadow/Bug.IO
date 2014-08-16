var socket = io.connect('/');

function notify(msg) {
  $('#notify').append(msg + '<br>');
}

function info(msg) {
  $('#info').append(msg + '<br>');
}

socket.on('new_message', function(message) {
  notify('There is a new message from ' + message.sender + ': ' + message.subject + ' - ' + message.body + '.');
});

socket.on('message', function(response, message, error) {
  info(response === true ? 'Message "' + message.subject + '" sent.' : error);
});

socket.on('login', function(response) {
  info(response === true ? 'Successfully logged in.' : 'Incorrect username.');
});

$(document).on('ready', function() {
  $('#login').on('submit', function(e) {
    e.preventDefault();

    var username = $('#username').val();
    socket.emit('login', { userid: username });
  });

  $('#message').on('submit', function(e) {
    e.preventDefault();
    
    var subject = $('#subject').val(),
        body = $('#body').val(),
        recipients = $('#recipients').val().split(' ');
    socket.send({ subject: subject, body: body, recipients: recipients });
  });
});
