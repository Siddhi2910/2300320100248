function assertArrayResponse(data, source) {
  if (!Array.isArray(data)) {
    const error = new Error(`${source} API returned invalid response`);
    error.statusCode = 502;
    throw error;
  }

  return data;
}

module.exports = {
  assertArrayResponse
};
