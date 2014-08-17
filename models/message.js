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
      validations: [
        ['minMax', { min: 1 }]
      ],
      index: true
    },
    recipients: {
      type: 'array',
      validations: [
        ['minMax', { min: 1 }]
      ]
    },
    ccs: {
      type: 'object'
    }
  }
});
