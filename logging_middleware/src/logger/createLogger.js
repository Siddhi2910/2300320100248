const { LOG_LEVELS, getLoggerConfig } = require('../config/loggerConfig');

function serializeError(error) {
  if (!error) return undefined;

  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  };
}

function createLogger(options = {}) {
  const config = getLoggerConfig(options);

  function shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[config.level];
  }

  function write(level, message, meta = {}) {
    if (!shouldLog(level)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: config.serviceName,
      message,
      ...meta
    };

    const output = JSON.stringify(logEntry);

    if (level === 'error') {
      console.error(output);
      return;
    }

    if (level === 'warn') {
      console.warn(output);
      return;
    }

    console.log(output);
  }

  return {
    error: (message, meta = {}) => write('error', message, meta),
    warn: (message, meta = {}) => write('warn', message, meta),
    info: (message, meta = {}) => write('info', message, meta),
    debug: (message, meta = {}) => write('debug', message, meta),
    child: (childMeta = {}) => ({
      error: (message, meta = {}) => write('error', message, { ...childMeta, ...meta }),
      warn: (message, meta = {}) => write('warn', message, { ...childMeta, ...meta }),
      info: (message, meta = {}) => write('info', message, { ...childMeta, ...meta }),
      debug: (message, meta = {}) => write('debug', message, { ...childMeta, ...meta })
    }),
    serializeError
  };
}

module.exports = {
  createLogger,
  serializeError
};
