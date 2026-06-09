const service = require('../services/notificationService');

function notFound() {
  const error = new Error('notification not found');
  error.statusCode = 404;
  return error;
}

function create(req, res) {
  res.status(201).json({ data: service.createNotification(req.body) });
}

function findAll(req, res) {
  res.json({ data: service.getAllNotifications() });
}

function findUnread(req, res) {
  res.json({ data: service.getUnreadNotifications() });
}

function findById(req, res, next) {
  const notification = service.getNotificationById(req.params.id);
  if (!notification) return next(notFound());
  return res.json({ data: notification });
}

function markRead(req, res, next) {
  const notification = service.markNotificationRead(req.params.id);
  if (!notification) return next(notFound());
  return res.json({ data: notification });
}

function markAllRead(req, res) {
  res.json({ updated: service.markAllNotificationsRead() });
}

module.exports = { create, findAll, findUnread, findById, markRead, markAllRead };
