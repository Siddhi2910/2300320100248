const { getConfig } = require('../config/env');
const { createHttpClient } = require('./createHttpClient');
const { assertArrayResponse } = require('../utils/validateApiResponse');

const config = getConfig();
const client = createHttpClient({
  baseUrl: config.vehicleApi.baseUrl,
  token: config.vehicleApi.token,
  source: 'Vehicle',
  timeoutMs: config.apiTimeoutMs
});

async function getVehicles() {
  const response = await client.get('/vehicles');
  return assertArrayResponse(response.data, 'Vehicle');
}

module.exports = {
  getVehicles
};
