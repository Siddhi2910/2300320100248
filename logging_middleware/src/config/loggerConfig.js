const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

function getLoggerConfig(overrides = {}) {
  const level = overrides.level || process.env.LOG_LEVEL || 'info';
  const serviceName = overrides.serviceName || process.env.SERVICE_NAME || 'app';

  return {
    level: LOG_LEVELS[level] === undefined ? 'info' : level,
    serviceName
  };
}

module.exports = {
  LOG_LEVELS,
  getLoggerConfig
};
