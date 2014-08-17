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
      type: 'integer',
      minMax: { min: 1 }
      index: true
    },
    recipients: {
      type: 'object'
    },
    ccs: {
      type: 'object'
    }
  }
});