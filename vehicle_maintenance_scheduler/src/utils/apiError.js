function toExternalApiError(error, source) {
  const status = error.response ? error.response.status : 503;
  const message = error.response
    ? `${source} API request failed with status ${status}`
    : `${source} API request failed`;

  const apiError = new Error(message);
  apiError.statusCode = status;
  apiError.source = source;
  apiError.details = error.response ? error.response.data : error.message;

  return apiError;
}

module.exports = {
  toExternalApiError
};
