const { createServiceLogger } = require('../../../logging_middleware');
const { getConfig } = require('./env');

const config = getConfig();

const logger = createServiceLogger(config.serviceName, {
  level: config.logLevel
});

module.exports = {
  logger
};
