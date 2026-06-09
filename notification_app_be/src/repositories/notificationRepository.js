const notifications = [];
let nextId = 1;

function create(data) {
  const notification = {
    id: String(nextId),
    ...data,
    read: false,
    createdAt: new Date().toISOString()
  };
  nextId += 1;
  notifications.push(notification);
  return notification;
}

function findAll() {
  return [...notifications];
}

function findById(id) {
  return notifications.find((item) => item.id === id);
}

function markRead(id) {
  const notification = findById(id);
  if (!notification) return null;
  notification.read = true;
  notification.readAt = new Date().toISOString();
  return notification;
}

function markAllRead() {
  const readAt = new Date().toISOString();
  notifications.forEach((item) => {
    item.read = true;
    item.readAt = item.readAt || readAt;
  });
  return notifications.length;
}

module.exports = { create, findAll, findById, markRead, markAllRead };
