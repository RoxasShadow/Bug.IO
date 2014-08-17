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
      // TODO: Remove empty elements on save
      validations: [
        function checkIsNotEmpty(value, options, callback) {
          if(typeof value != 'object' || value.length == 0)
            callback(false);
          else {
            var newArray = [];
            value.forEach(function(e) {
              if(e.trim().length > 0)
                newArray.push(e);
            });
            callback(newArray.length > 0);
          }
        }
      ]
    },
    ccs: {
      type: 'array'
      // TODO: Remove empty elements on save
    },
    body: {
      type: 'string'
    }
  }
});
