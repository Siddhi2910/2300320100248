const { createLogger } = require('../logger/createLogger');

function createRequestLogger(options = {}) {
  const logger = options.logger || createLogger(options);

  return function requestLogger(req, res, next) {
    const startedAt = Date.now();

    logger.info('request received', {
      method: req.method,
      path: req.originalUrl || req.url,
      ip: req.ip
    });

    res.on('finish', () => {
      logger.info('response sent', {
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt
      });
    });

    next();
  };
}

module.exports = {
  createRequestLogger
};
