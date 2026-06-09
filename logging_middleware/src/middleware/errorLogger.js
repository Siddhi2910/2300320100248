const { createLogger, serializeError } = require('../logger/createLogger');

function createErrorLogger(options = {}) {
  const logger = options.logger || createLogger(options);

  return function errorLogger(error, req, res, next) {
    logger.error('request failed', {
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: error.statusCode || 500,
      error: serializeError(error)
    });

    next(error);
  };
}

module.exports = {
  createErrorLogger
};
