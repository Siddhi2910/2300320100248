const express = require('express');
const controller = require('../controllers/notificationController');
const { validateNotification, validateId } = require('../validators/notificationValidator');

const router = express.Router();

router.post('/notifications', validateNotification, controller.create);
router.get('/notifications', controller.findAll);
router.get('/notifications/unread', controller.findUnread);
router.get('/notifications/:id', validateId, controller.findById);
router.patch('/notifications/:id/read', validateId, controller.markRead);
router.patch('/notifications/read-all', controller.markAllRead);

module.exports = router;
