# Logging Middleware

Reusable Express-compatible logging package for project services.

## Architecture

| File | Purpose |
| --- | --- |
| `src/config/loggerConfig.js` | Reads log level and service name from environment variables. |
| `src/logger/createLogger.js` | Creates structured JSON service loggers. |
| `src/middleware/requestLogger.js` | Logs incoming requests and completed responses. |
| `src/middleware/errorLogger.js` | Logs request errors and forwards them to the app error handler. |
| `src/index.js` | Public exports for future services. |

## Usage

```js
const express = require('express');
const {
  createServiceLogger,
  createRequestLogger,
  createErrorLogger
} = require('../logging_middleware');

const app = express();
const logger = createServiceLogger('notification-service');

app.use(createRequestLogger({ logger }));

app.get('/health', (req, res) => {
  logger.info('health check');
  res.json({ status: 'ok' });
});

app.use(createErrorLogger({ logger }));
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    error: error.message || 'Internal server error'
  });
});
```

## Configuration

```env
LOG_LEVEL=info
SERVICE_NAME=notification-service
```

Supported levels: `error`, `warn`, `info`, `debug`.

## Test

```bash
npm test
```

Expected output:

```json
{"timestamp":"...","level":"info","service":"test","message":"logger loaded"}
```
