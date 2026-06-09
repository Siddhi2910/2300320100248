require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  serviceName: process.env.SERVICE_NAME || 'notification-app-be',
  logLevel: process.env.LOG_LEVEL || 'info'
};
