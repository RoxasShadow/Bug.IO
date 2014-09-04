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
      type: 'json',
      validations: [
        function checkIsNotEmpty(value, options, callback) {
          value = JSON.parse(value);
          callback(typeof value == 'object' && value.length > 0 && value.filter(function(e) { return !!e; }).length > 0);
        }
      ]
    },
    ccs: {
      type: 'json'
    },
    body: {
      type: 'string'
    }
  }
});
