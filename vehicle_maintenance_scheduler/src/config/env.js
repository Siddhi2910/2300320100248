require('dotenv').config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getConfig() {
  return {
    serviceName: process.env.SERVICE_NAME || 'vehicle-maintenance-scheduler',
    logLevel: process.env.LOG_LEVEL || 'info',
    apiTimeoutMs: Number(process.env.API_TIMEOUT_MS || 5000),
    depotApi: {
      baseUrl: requireEnv('DEPOT_API_BASE_URL'),
      token: requireEnv('DEPOT_API_TOKEN')
    },
    vehicleApi: {
      baseUrl: requireEnv('VEHICLE_API_BASE_URL'),
      token: requireEnv('VEHICLE_API_TOKEN')
    }
  };
}

module.exports = {
  getConfig
};
