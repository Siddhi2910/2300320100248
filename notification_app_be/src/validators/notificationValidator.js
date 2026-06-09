const { logger } = require('../config/logger');

const VALID_TYPES = ['placement', 'result', 'event'];

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  logger.warn('validation failed', { message });
  return error;
}

function validateNotification(req, res, next) {
  const { title, message, type } = req.body;

  if (!title) return next(validationError('title is required'));
  if (!message) return next(validationError('message is required'));
  if (!type) return next(validationError('type is required'));
  if (!VALID_TYPES.includes(type)) return next(validationError('type must be placement, result, or event'));

  return next();
}

function validateId(req, res, next) {
  if (!req.params.id || Number.isNaN(Number(req.params.id))) {
    return next(validationError('invalid notification id'));
  }
  return next();
}

module.exports = { validateNotification, validateId };
