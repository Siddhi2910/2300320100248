const { createServiceLogger } = require('../../../logging_middleware');
const config = require('./env');

const logger = createServiceLogger(config.serviceName, {
  level: config.logLevel
});

module.exports = { logger };
