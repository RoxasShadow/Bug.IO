var nohm = require('nohm').Nohm;

module.exports = nohm.model('Message', {
  properties: {
    sender: {
      type: 'integer',
      validations: [
        ['minMax', { min: 1 }]
      ],
      index: true
    },
    subject: {
      type: 'string',
      validations: [ 'notEmpty' ]
    },
    recipients: {
      type: 'array',
      validations: [
        function checkIsNotEmpty(value, options, callback) {
          callback(typeof value == 'object' && value.length > 0 && value.join('').split('').length > 0);
        }
      ]
    },
    ccs: {
      type: 'array'
    },
    body: {
      type: 'string'
    }
  }
});
