const { getConfig } = require('../config/env');
const { createHttpClient } = require('./createHttpClient');
const { assertArrayResponse } = require('../utils/validateApiResponse');

const config = getConfig();
const client = createHttpClient({
  baseUrl: config.depotApi.baseUrl,
  token: config.depotApi.token,
  source: 'Depot',
  timeoutMs: config.apiTimeoutMs
});

async function getDepots() {
  const response = await client.get('/depots');
  return assertArrayResponse(response.data, 'Depot');
}

module.exports = {
  getDepots
};
