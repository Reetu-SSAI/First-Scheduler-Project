const Ajv = require('ajv').default;

const ajv = new Ajv({ allErrors: true });

// Compares a response body with a schema. Returns 'No errors', or one line per difference found.
function getSchemaErrors(body, schema) {
  const validate = ajv.compile(schema);
  validate(body);
  return ajv.errorsText(validate.errors, {
    dataVar: 'response',
    separator: '\n',
  });
}

module.exports = getSchemaErrors;
