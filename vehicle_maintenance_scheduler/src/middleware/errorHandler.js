const { logger } = require('../config/logger');

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  logger.error('request error', {
    statusCode,
    path: req.originalUrl,
    error: error.message
  });

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : error.message
  });
}

module.exports = {
  errorHandler
};
