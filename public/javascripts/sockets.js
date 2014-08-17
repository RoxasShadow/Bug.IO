var socket = io.connect('/');

function notify(msg) {
  $('#notify').append(msg + '<br>');
}

function info(msg) {
  $('#info').append(msg + '<br>');
}

socket.on('new_message', function(message) { // there is a new message
  notify('There is a new message from User#' + message.sender + ': ' + message.subject + ' - ' + message.body + '.');
});

socket.on('validation_failed', function(errors) { // error validating the sent message
  if(typeof errors == 'string')
    info('Error: ' + errors + '.');
  else
    for(error in errors)
      if(errors[error].length > 0)
        info('Error: fail in <em>' + error + '</em>#<em>' + errors[error] + '</em>.');
});

socket.on('message', function(response, message, error) { // message response
  info(response === true ? 'Message "' + message.subject + '" sent to User#' + message.sender + '.' : error);
});

socket.on('login', function(response) { // login response
  info(response === true ? 'Successfully logged in.' : 'Incorrect username.');
});

$(document).on('ready', function() {
  socket.emit('login');

  $('#message').on('submit', function(e) {
    e.preventDefault();
    
    var subject = $('#subject').val(),
        body = $('#body').val(),
        recipients = $('#recipients').val().split(' '),
        ccs = $('#ccs').val().split(' ');
    socket.send({ subject: subject, body: body, recipients: recipients, ccs: ccs });
  });
});
