const repository = require('../repositories/notificationRepository');
const { logger } = require('../config/logger');

const PRIORITY = { placement: 3, result: 2, event: 1 };

function sortByPriority(items) {
  return items.sort((a, b) => PRIORITY[b.type] - PRIORITY[a.type] || new Date(b.createdAt) - new Date(a.createdAt));
}

function createNotification(data) {
  const notification = repository.create(data);
  logger.info('notification created', { id: notification.id, type: notification.type });
  return notification;
}

function getAllNotifications() {
  return sortByPriority(repository.findAll());
}

function getUnreadNotifications() {
  return sortByPriority(repository.findAll().filter((item) => !item.read));
}

function getNotificationById(id) {
  return repository.findById(id);
}

function markNotificationRead(id) {
  return repository.markRead(id);
}

function markAllNotificationsRead() {
  return repository.markAllRead();
}

module.exports = {
  createNotification,
  getAllNotifications,
  getUnreadNotifications,
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead
};
