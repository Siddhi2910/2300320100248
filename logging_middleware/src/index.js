const { createLogger } = require('./logger/createLogger');
const { createRequestLogger } = require('./middleware/requestLogger');
const { createErrorLogger } = require('./middleware/errorLogger');

function createServiceLogger(serviceName, options = {}) {
  return createLogger({
    ...options,
    serviceName
  });
}

module.exports = {
  createLogger,
  createServiceLogger,
  createRequestLogger,
  createErrorLogger
};
