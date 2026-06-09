const express = require('express');
const { createRequestLogger, createErrorLogger } = require('../../logging_middleware');
const { logger } = require('./config/logger');
const schedulerRoutes = require('./routes/schedulerRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(createRequestLogger({ logger }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', schedulerRoutes);
app.use(createErrorLogger({ logger }));
app.use(errorHandler);

module.exports = app;
