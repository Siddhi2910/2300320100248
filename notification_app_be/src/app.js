const express = require('express');
const { createRequestLogger, createErrorLogger } = require('../../logging_middleware');
const { logger } = require('./config/logger');
const routes = require('./routes/notificationRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(createRequestLogger({ logger }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use(createErrorLogger({ logger }));
app.use(errorHandler);

module.exports = app;
