var nohm = require('nohm').Nohm;

module.exports = nohm.model('Message', {
  properties: {
    subject: {
      type: 'string',
      validations: [ 'notEmpty' ]
    },
    body: {
      type: 'string'
    },
    sender: {
      type: 'string',
      validations: [ 'notEmpty' ]
    },
    recipients: {
      type: 'object'
    },
  }
});