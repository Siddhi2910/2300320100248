const axios = require('axios');
const { logger } = require('../config/logger');
const { toExternalApiError } = require('../utils/apiError');

function createHttpClient({ baseUrl, token, source, timeoutMs }) {
  const client = axios.create({
    baseURL: baseUrl,
    timeout: timeoutMs,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  client.interceptors.request.use((config) => {
    config.metadata = { startedAt: Date.now() };
    logger.info('external request started', {
      source,
      method: config.method,
      url: `${config.baseURL}${config.url}`
    });
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      logger.info('external request succeeded', {
        source,
        statusCode: response.status,
        durationMs: Date.now() - response.config.metadata.startedAt
      });
      return response;
    },
    (error) => {
      const durationMs = error.config && error.config.metadata
        ? Date.now() - error.config.metadata.startedAt
        : undefined;

      logger.error('external request failed', {
        source,
        statusCode: error.response && error.response.status,
        durationMs,
        error: error.message
      });

      return Promise.reject(toExternalApiError(error, source));
    }
  );

  return client;
}

module.exports = {
  createHttpClient
};
